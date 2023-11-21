const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const axios = require('axios');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const googleAuthenticate = require('../utils/googleAuthenticate');

const signToken = (id, secret, expiresIn) =>
  jwt.sign(
    {
      id,
    },
    secret,
    {
      expiresIn: expiresIn,
    }
  );

const createSendToken = (user, statusCode, res) => {
  const token = signToken(
    user._id,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN
  );
  const refreshToken = signToken(
    user._id,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN
  );
  const cookieOptions = [
    {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
      ),
      httpOnly: true,
    },
    {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    },
  ];
  if (process.env.NODE_ENV === 'production') {
    cookieOptions[0].secure = true;
    cookieOptions[1].secure = true;
  }
  console.log(cookieOptions[0]);
  res.cookie('jwt', token, cookieOptions[0]);
  res.cookie('jwt_refresh', refreshToken, cookieOptions[1]);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError('Incorrect email', 401));
  const correct = await user.correctPassword(password, user.password);
  if (!correct) return next(new AppError('Incorrect password', 401));

  createSendToken(user, 201, res);
});

exports.google = passport.authenticate('google', {
  scope: ['profile', 'email'],
});
exports.googleCallback = passport.authenticate('google', {
  session: false,
});

exports.googleSuccess = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { email: req.user.emails[0].value },
    {
      email: req.user.emails[0].value,
      name: req.user.displayName,
      googleId: req.user.id,
      avatar: req.user.photos[0].value,
    },
    { upsert: true, new: true }
  );
  console.log(user);
  createSendToken(user, 201, res);
});

exports.ggLogin = catchAsync(async (req, res, next) => {
  const { idToken } = req.body;

  const response = await axios.post(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  const { data } = response;
  const user = await User.findOneAndUpdate(
    { email: data.email },
    {
      email: data.email,
      name: data.name,
      googleId: data.sub,
      avatar: data.picture,
    },
    { upsert: true, new: true }
  );
  console.log(user);
  createSendToken(user, 201, res);
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  let refreshToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    refreshToken = req.headers.authorization.split(' ')[1];
  }
  if (!refreshToken) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  const userId = await new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      }
      resolve(payload.id);
    });
  });
  const user = await User.findById(userId);
  createSendToken(user, 201, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  req.user = freshUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with email address.', 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 201, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 201, res);
});

exports.getAuth = catchAsync(async (req, res, next) => {
  const { user } = req;
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.ggLogin = catchAsync(async (req, res, next) => {
  const { idToken } = req.body;

  const response = await axios.post(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  const { data } = response;
  const user = await User.findOneAndUpdate(
    { email: data.email },
    {
      email: data.email,
      name: data.name,
      googleId: data.sub,
      avatar: data.picture,
    },
    { upsert: true, new: true }
  );
  console.log(user);
  createSendToken(user, 201, res);
});

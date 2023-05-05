const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const { uploadFile } = require('../utils/googleUploadFile');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.uploadUserAvatar = upload.single('avatar');
exports.resizeUserAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const ext = req.file.mimetype.split('/')[1];
  req.file.filename = `user-${req.user.id}-${Date.now()}.${ext}`;
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 100, height: 100 })
    .toBuffer();
  const avatar = await uploadFile(
    buffer,
    req.file.filename,
    req.file.mimetype,
    process.env.GOOGLE_DRIVE_USERS_FOLDER_ID
  );
  next();
});
exports.getAllUsers = factory.getAll(User);
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword.',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name');
  if (req.file) filteredBody.avatar = req.file.filename;
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

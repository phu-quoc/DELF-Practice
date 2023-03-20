const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

exports.initPassport = app => {
  //init's the app session
  app.use(
    session({
      saveUninitialized: false,
      secret: process.env.KEY_SESSION,
    })
  );
  //init passport
  app.use(passport.initialize());
  app.use(passport.session());
};

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      cb(null, profile);
    }
  )
);

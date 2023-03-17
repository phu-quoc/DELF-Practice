const express = require('express');
const morgan = require('morgan');

const passport = require('passport');
const session = require('express-session');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const grammarRouter = require('./routes/grammarRoutes');

const app = express();

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
const store = session.MemoryStore();
app.use(
  session({
    saveUninitialized: false,
    secret: process.env.KEY_SESSION,
    cookie: {
      maxAge: 1000 * 10,
    },
    store,
  })
);
app.use(express.static(`${__dirname}/public`));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES

app.use('/api/v1/users', userRouter);
app.use('/api/v1/grammars', grammarRouter);
app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;

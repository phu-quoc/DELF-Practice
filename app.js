const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require('./utils/appError');
const { initPassport } = require('./utils/googleAuthenticate');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const grammarRouter = require('./routes/grammarRoutes');
const resultRouter = require('./routes/resultRoutes');
const questionRouter = require('./routes/questionRoutes');
const examinationRouter = require('./routes/examinationRoutes');
const vocabularyRouter = require('./routes/vocabularyRoutes');
const answerRouter = require('./routes/answerRoutes');
const exerciseRouter = require('./routes/exerciseRoutes');
const favoriteRouter = require('./routes/favoriteRoutes');
const paymentRouter = require('./routes/paymentRoutes');

const app = express();

initPassport(app);
// MIDDLEWARES
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/grammars', grammarRouter);
app.use('/api/v1/results', resultRouter);
app.use('/api/v1/questions', questionRouter);
app.use('/api/v1/examinations', examinationRouter);
app.use('/api/v1/vocabularies', vocabularyRouter);
app.use('/api/v1/answers', answerRouter);
app.use('/api/v1/exercises', exerciseRouter);
app.use('/api/v1/favorites', favoriteRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;

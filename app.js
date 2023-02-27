const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routes/userRoutes');
const grammarRouter = require('./routes/grammarRoutes');

const app = express();

// 1. MIDDLEWAREs
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2. ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3. ROUTES

app.use('/api/v1/users', userRouter);
app.use('/api/v1/grammars', grammarRouter);

module.exports = app;

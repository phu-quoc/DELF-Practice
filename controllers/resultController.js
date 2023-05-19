const Result = require('../models/resultModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getMyResults = catchAsync(async (req, res, next) => {
  const results = await Result.find({ user: req.user.id });
  res.status(200).json({
    status: 'success',
    results: results.length,
    data: results,
  });
});

exports.getAllResults = factory.getAll(Result);
exports.getResult = factory.getOne(Result, {
  path: 'answers',
});
exports.createResult = factory.createOne(Result);
exports.deleteResult = factory.deleteOne(Result);

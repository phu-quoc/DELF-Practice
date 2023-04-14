const Result = require('../models/resultModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllResults = catchAsync(async (req, res, next) => {
  const results = await Result.find();
  res.status(200).json({
    status: 'success',
    results: results.length,
    data: {
      results,
    },
  });
});

exports.createResult = factory.createOne(Result);
exports.deleteResult = factory.deleteOne(Result);

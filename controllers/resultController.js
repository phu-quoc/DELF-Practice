const Result = require('../models/resultModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllResults = factory.getAll(Result);
exports.getResult = factory.getOne(Result, {
  path: 'answers',
});
exports.createResult = factory.createOne(Result);
exports.deleteResult = factory.deleteOne(Result);

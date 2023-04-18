const Result = require('../models/resultModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllResults = factory.getAll(Result);
exports.getResult = factory.getOne(Result);
exports.createResult = factory.createOne(Result);
exports.deleteResult = factory.deleteOne(Result);

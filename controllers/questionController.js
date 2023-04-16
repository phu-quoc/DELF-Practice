const Question = require('../models/questionModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllQuestions = factory.getAll(Question);

exports.createQuestion = factory.createOne(Question);
exports.deleteQuestion = factory.deleteOne(Question);

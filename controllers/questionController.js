const Question = require('../models/questionModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllQuestions = catchAsync(async (req, res, next) => {
  const questions = await Question.find();
  res.status(200).json({
    status: 'success',
    results: questions.length,
    data: {
      questions,
    },
  });
});

exports.createQuestion = factory.createOne(Question);
exports.deleteQuestion = factory.deleteOne(Question);

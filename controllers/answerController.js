const factory = require('./handlerFactory');
const Answer = require('../models/answerModel');

exports.getAllAnswers = factory.getAll(Answer);
exports.getAnswer = factory.getOne(Answer);
exports.createAnswer = factory.createOne(Answer);
exports.deleteAnswer = factory.deleteOne(Answer);

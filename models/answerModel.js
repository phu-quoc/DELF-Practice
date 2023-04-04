const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
  resultId: { type: mongoose.Schema.Types.ObjectId, ref: 'Result' },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  answer: String,
  mark: Number,
});

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;

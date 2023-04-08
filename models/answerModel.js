const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  result: { type: mongoose.Schema.Types.ObjectId, ref: 'Result' },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  answer: String,
  mark: Number,
});

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;

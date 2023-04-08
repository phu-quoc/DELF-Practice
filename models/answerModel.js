const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  result: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Result',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  answer: String,
  mark: Number,
});

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;

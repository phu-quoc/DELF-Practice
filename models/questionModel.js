const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
  },
  category: {
    type: String,
    enum: ['Listening', 'Speaking', 'Reading', 'Writing'],
    required: true,
  },
  question: String,
  image: String,
  audio: String,
  options: [
    {
      content: String,
      isCorrect: { type: Boolean, default: false },
    },
  ],
  explain: String,
  point: Number,
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;

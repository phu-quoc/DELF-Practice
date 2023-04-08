const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Examination',
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
      id: Number,
      name: String,
      content: String,
      isCorrect: Boolean,
    },
  ],
  explain: String,
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;

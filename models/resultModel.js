const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Examination',
    required: true,
  },
  score: Number,
});

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;

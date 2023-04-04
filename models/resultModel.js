const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  examinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Examination',
  },
  score: Number,
});

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;

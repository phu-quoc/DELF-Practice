const mongoose = require('mongoose');
const User = require('./userModel');
const Examination = require('./examinationModel');

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Examination',
    required: true,
  },
  score: Number,
});

resultSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  }).populate({
    path: 'examination',
    select: 'name timeLimit',
  });
  next();
});
const Result = mongoose.model('Result', resultSchema);
module.exports = Result;

const mongoose = require('mongoose');
const User = require('./userModel');
const Examination = require('./examinationModel');

const resultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    examination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Examination',
      required: true,
    },
    score: { type: Number, default: 0 },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

resultSchema.index({ score: 1 });

resultSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  }).populate({
    path: 'examination',
    select: 'name timeLimit type',
  });
  next();
});

resultSchema.virtual('answers', {
  ref: 'Answer',
  foreignField: 'result',
  localField: '_id',
});

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;

const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    examination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Examination',
    },
    description: String,
    paragraph: String,
    type: {
      type: String,
      enum: [
        'Listening 1',
        'Listening 2',
        'Listening 3',
        'Reading 1',
        'Reading 2',
        'Reading 3',
        'Writing',
      ],
    },
    image: String,
    audio: String,
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

exerciseSchema.virtual('questions', {
  ref: 'Question',
  foreignField: 'exercise',
  localField: '_id',
});

exerciseSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'questions',
  });
  next();
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise;

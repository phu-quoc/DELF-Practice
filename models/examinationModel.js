const mongoose = require('mongoose');

const examinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    timeLimit: { type: Number, required: true },
    description: String,
    type: {
      type: String,
      enum: ['Listening, Speaking, Reading, Writing, Mini Test, Full Test'],
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
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

examinationSchema.virtual('questions', {
  ref: 'Question',
  foreignField: 'examination',
  localField: '_id',
});

const Examination = mongoose.model('Examination', examinationSchema);
module.exports = Examination;

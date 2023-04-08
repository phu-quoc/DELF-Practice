const mongoose = require('mongoose');

const examinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  timeLimit: { type: Number, required: true },
  description: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Examination = mongoose.model('Examination', examinationSchema);
module.exports = Examination;

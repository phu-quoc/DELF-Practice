const mongoose = require('mongoose');

const examinationSchema = mongoose.Schema({
  name: { type: String, required: true },
  timeLimit: { type: Number, required: true },
  description: String,
});

const Examination = mongoose.model('Examination', examinationSchema);
module.exports = Examination;

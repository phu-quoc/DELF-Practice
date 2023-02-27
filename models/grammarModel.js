const mongoose = require('mongoose');

const grammarSchema = new mongoose.Schema({
  grammar: {
    type: String,
    required: [true, 'A grammar must have a valid name'],
    unique: [true, 'A grammar must be unique'],
  },
  content: {
    type: String,
    required: [true, 'A grammar must have a valid content'],
  },
});

const Grammar = mongoose.model('Grammar', grammarSchema);

module.exports = Grammar;

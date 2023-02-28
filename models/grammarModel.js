const mongoose = require('mongoose');

const grammarSchema = new mongoose.Schema(
  {
    grammar: {
      type: String,
      required: [true, 'A grammar must have a valid name'],
      unique: [true, 'A grammar must be unique'],
    },
    content: {
      type: String,
      required: [true, 'A grammar must have a valid content'],
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

grammarSchema.virtual('grammarLength').get(function () {
  return this.grammar.length;
});

const Grammar = mongoose.model('Grammar', grammarSchema);

module.exports = Grammar;

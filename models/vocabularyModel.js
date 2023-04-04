const mongoose = require('mongoose');

const vocabularySchema = mongoose.Schema({
  partOfSpeech: {
    type: String,
    required: true,
    enum: [
      'Adjective',
      'Adverb',
      'Article',
      'Conjunction',
      'Noun',
      'Preposition',
      'Pronoun',
      'Verb',
    ],
  },
  word: {
    type: String,
    required: true,
  },
  pronunciation: {
    type: String,
    required: true,
  },
  phonetic: String,
  definition: String,
  examples: [
    {
      id: Number,
      sentence: String,
      translation: String,
    },
  ],
});

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

module.exports = Vocabulary;

const Vocabulary = require('../models/vocabularyModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllVocabularies = factory.getAll(Vocabulary);
exports.getVocabulary = factory.getOne(Vocabulary);
exports.createVocabulary = factory.createOne(Vocabulary);
exports.deleteVocabulary = factory.deleteOne(Vocabulary);

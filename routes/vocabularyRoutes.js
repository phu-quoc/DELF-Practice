const express = require('express');

const vocabularyController = require('../controllers/vocabularyController');

const router = express.Router();

router
  .route('/')
  .get(vocabularyController.getAllVocabularies)
  .post(vocabularyController.createVocabulary);

router
  .route('/:id')
  .get(vocabularyController.getVocabulary)
  .delete(vocabularyController.deleteVocabulary);

module.exports = router;

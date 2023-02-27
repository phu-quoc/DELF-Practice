const express = require('express');
const grammarController = require('../controllers/grammarController');

const router = express.Router();

router
  .route('/')
  .get(grammarController.getAllGrammars)
  .post(grammarController.createGrammar);

router
  .route('/:id')
  .get(grammarController.getGrammar)
  .patch(grammarController.updateGrammar)
  .delete(grammarController.deleteGrammar);

module.exports = router;

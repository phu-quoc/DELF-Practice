const express = require('express');
const grammarController = require('../controllers/grammarController');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/grammar-stats').get(grammarController.getGrammarStats);

router
  .route('/top-5-popular')
  .get(grammarController.aliasTopGrammars, grammarController.getAllGrammars);

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

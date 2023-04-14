const express = require('express');

const router = express.Router();
const resultController = require('../controllers/resultController');

router
  .route('/')
  .get(resultController.getAllResults)
  .post(resultController.createResult);

router.route('/:id').delete(resultController.deleteResult);
module.exports = router;

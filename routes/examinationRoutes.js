const express = require('express');

const examinationController = require('../controllers/examinationController');

const router = express.Router();

router
  .route('/')
  .get(examinationController.getAllExaminations)
  .post(examinationController.createExamination);
router
  .route('/:id')
  .get(examinationController.getExamination)
  .delete(examinationController.deleteExamination);
module.exports = router;

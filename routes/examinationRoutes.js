const express = require('express');

const examinationController = require('../controllers/examinationController');
const questionRouter = require('./questionRoutes');

const router = express.Router();

router.use('/:examinationId/questions', questionRouter);
router
  .route('/')
  .get(examinationController.getAllExaminations)
  .post(examinationController.createExamination);
router
  .route('/:id')
  .get(examinationController.getExamination)
  .delete(examinationController.deleteExamination);
module.exports = router;

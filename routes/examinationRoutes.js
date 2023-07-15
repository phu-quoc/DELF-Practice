const express = require('express');

const examinationController = require('../controllers/examinationController');
const exerciseRouter = require('./exerciseRoutes');

// const router = express.Router();
const router = express.Router({ mergeParams: true });

router.use('/:examinationId/exercises', exerciseRouter);
router
  .route('/')
  .get(examinationController.getAllExaminations)
  .post(examinationController.createExamination);
router
  .route('/:id')
  .get(examinationController.getExamination)
  .delete(examinationController.deleteExamination);
module.exports = router;

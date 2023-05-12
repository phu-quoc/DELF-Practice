const express = require('express');

const exerciseController = require('../controllers/exerciseController');
const questionRouter = require('./questionRoutes');

const router = express.Router();

router.use('/:exerciseId/questions', questionRouter);
router
  .route('/')
  .get(exerciseController.getAllExercises)
  .post(exerciseController.createExercise);
router
  .route('/:id')
  .get(exerciseController.getExercise)
  .delete(exerciseController.deleteExercise);
module.exports = router;

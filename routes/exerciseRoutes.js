const express = require('express');

const exerciseController = require('../controllers/exerciseController');
const questionRouter = require('./questionRoutes');
const questionController = require('../controllers/questionController');

const router = express.Router({ mergeParams: true });

router.use('/:exerciseId/questions', questionRouter);
router
  .route('/')
  .get(exerciseController.setExaminationId, exerciseController.getAllExercises)
  .post(
    exerciseController.uploadExerciseImage,
    exerciseController.resizeExerciseImage,
    exerciseController.setExaminationId,
    exerciseController.createExercise
  );
router
  .route('/:id')
  .get(exerciseController.getExercise)
  .put(exerciseController.updateExercise)
  .delete(exerciseController.deleteExercise);
module.exports = router;

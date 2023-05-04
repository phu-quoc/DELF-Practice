const express = require('express');
const exerciseController = require('../controllers/exerciseController');
const router = express.Router();

router
    .route('/')
    .get(exerciseController.getAllExercises)
    .post(exerciseController.createExercise);
router.post('/get-exercises-of-exam', exerciseController.getExercisesOfExams);

router
    .route('/:id')
    .get(exerciseController.getExercise)
    .delete(exerciseController.deleteExercise);
module.exports = router;

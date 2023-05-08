const express = require('express');

const questionController = require('../controllers/questionController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(questionController.getAllQuestions)
  .post(
    questionController.uploadQuestionImage,
    questionController.resizeQuestionImage,
    questionController.setExaminationId,
    questionController.createQuestion
  );

router
  .route('/:id')
  .get(questionController.getQuestion)
  .delete(questionController.deleteQuestion);

module.exports = router;

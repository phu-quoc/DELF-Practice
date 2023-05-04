const express = require('express');
const answerController = require('../controllers/answerController');
const examinationController = require('../controllers/examinationController');

const router = express.Router();

router
    .route('/')
    .get(answerController.getAllAnswers)
    .post(answerController.createAnswer);
router.post('/save', answerController.postAnswers);
router
    .route('/:id')
    .get(answerController.getAnswer)
    .delete(answerController.deleteAnswer);
module.exports = router;
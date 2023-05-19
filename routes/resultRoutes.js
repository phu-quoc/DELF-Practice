const express = require('express');

const router = express.Router();
const resultController = require('../controllers/resultController');
const authController = require('../controllers/authController');
const answerRouter = require('./answerRoutes');

router.use('/:resultId/answers', answerRouter);
router.get(
  '/my-results',
  authController.protect,
  resultController.getMyResults
);
router
  .route('/')
  .get(resultController.getAllResults)
  .post(
    authController.protect,
    resultController.setUserId,
    resultController.createResult
  );

router
  .route('/:id')
  .get(resultController.getResult)
  .delete(resultController.deleteResult);
module.exports = router;

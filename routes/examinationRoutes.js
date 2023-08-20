const express = require('express');

const examinationController = require('../controllers/examinationController');
const exerciseRouter = require('./exerciseRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:examinationId/exercises', exerciseRouter);

// router.post('/file', examinationController.uploadFileXlsx, async (req, res) => {
//   console.log(req.body);
//   const file = await xlsx.read(req.file.buffer);
//   const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
//
//   res.status(200).json({
//     status: 'success',
//     data: req.body,
//   });
// });

router.post(
  '/import-xlsx',
  examinationController.uploadFileXlsx,
  examinationController.createExaminationByXlsx
);
router
  .route('/')
  .get(examinationController.getAllExaminations)
  .post(examinationController.createExamination);
router
  .route('/:id')
  .get(examinationController.getExamination)
  .delete(examinationController.deleteExamination);
module.exports = router;

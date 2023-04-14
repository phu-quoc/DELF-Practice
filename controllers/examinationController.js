const Examination = require('../models/examinationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllExaminations = catchAsync(async (req, res, next) => {
  const examinations = await Examination.find();
  res.status(200).json({
    status: 'success',
    results: examinations.length,
    data: {
      examinations,
    },
  });
});

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createExamination = factory.createOne(Examination);

exports.getExamination = catchAsync(async (req, res, next) => {
  const examination = await Examination.findById(req.params.id);
  // const examination = await Examination.findById(req.params.id).populate({
  //   path: 'questions',
  // });
  if (!examination) {
    return next(new AppError('No examination found with that Id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      examination,
    },
  });
});

exports.deleteExamination = factory.deleteOne(Examination);

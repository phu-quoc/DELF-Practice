const Examination = require('../models/examinationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllExaminations = factory.getAll(Examination);

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createExamination = factory.createOne(Examination);
exports.getExamination = factory.getOne(Examination, {
  path: 'questions',
});
exports.deleteExamination = factory.deleteOne(Examination);

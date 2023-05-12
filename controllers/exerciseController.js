const Exercise = require('../models/exerciseModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllExercises = factory.getAll(Exercise);
exports.createExercise = factory.createOne(Exercise);
exports.getExercise = factory.getOne(Exercise, {
  path: 'questions',
});
exports.deleteExercise = factory.deleteOne(Exercise);

const multer = require('multer');
const sharp = require('sharp');
const Question = require('../models/questionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadQuestionImage = upload.single('image');
exports.resizeQuestionImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const ext = req.file.mimetype.split('/')[1];
  req.body.image = `${Date.now()}.${ext}`;
  await sharp(req.file.buffer).toFile(`public/img/questions/${req.body.image}`);

  next();
});
exports.getAllQuestions = factory.getAll(Question);
exports.getQuestion = factory.getOne(Question);
exports.createQuestion = factory.createOne(Question);
exports.deleteQuestion = factory.deleteOne(Question);

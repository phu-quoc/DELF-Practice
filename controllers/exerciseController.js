const multer = require('multer');
const sharp = require('sharp');
const Exercise = require('../models/exerciseModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const { uploadFile } = require('../utils/googleUploadFile');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadExerciseImage = upload.single('image');
exports.resizeExerciseImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const ext = req.file.mimetype.split('/')[1];
  req.body.image = `${Date.now()}.jpeg`;
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 350 })
    .toFormat('jpeg')
    .toBuffer();
  console.log(buffer);
  const image = await uploadFile(
    buffer,
    req.body.image,
    'image/jpeg',
    process.env.GOOGLE_DRIVE_EXERCISES_FOLDER_ID
  );
  next();
});

exports.setExaminationId = (req, res, next) => {
  if (!req.body.examination) req.body.examination = req.params.examinationId;
  console.log(req.body.examination);
  next();
};

exports.getAllExercises = factory.getAll(Exercise);
exports.createExercise = factory.createOne(Exercise);
exports.getExercise = factory.getOne(Exercise, {
  path: 'questions',
});
exports.deleteExercise = factory.deleteOne(Exercise);

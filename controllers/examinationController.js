const xlsx = require('xlsx');
const multer = require('multer');
const Examination = require('../models/examinationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const Exercise = require('../models/exerciseModel');
const Question = require('../models/questionModel');

exports.getAllExaminations = factory.getAll(Examination);

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const multerFilter = (req, file, cb) => {
  if (file.mimetype.includes('sheet')) {
    cb(null, true);
  } else {
    cb(
      new AppError('Not a xlsx! Please upload only xlsx extensions.', 400),
      false
    );
  }
};
const upload = multer({ fileFilter: multerFilter });

exports.uploadFileXlsx = upload.single('file');
exports.createExamination = factory.createOne(Examination);
exports.getExamination = factory.getOne(Examination, {
  path: 'exercises',
});
exports.deleteExamination = factory.deleteOne(Examination);
exports.createExaminationByXlsx = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const file = await xlsx.read(req.file.buffer);
  const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);

  const questionsTemp = temp.splice(temp.findIndex(el => el.exercise));
  const questionsConverted = [];
  temp.map(el => {
    el.examination = req.body.examination;
    return el;
  });
  const exercises = await Exercise.create(temp);
  const ids = exercises.reduce(
    (preObj, curObj) =>
      Object.assign(preObj, {
        [curObj.type.replaceAll(/\s|\./g, '')]: curObj.id,
      }),
    {}
  );

  await questionsTemp.forEach(el => {
    //The number of question options
    const optionLength = Object.keys(el).length - 5;
    el.options = [
      { content: el.optionA },
      { content: el.optionB },
      { content: el.optionC },
    ];
    // eslint-disable-next-line no-plusplus
    for (let i = optionLength; i < 3; i++) {
      el.options.pop();
    }
    if (el.options.length > 0) el.options[el.correct].isCorrect = true;

    el.exercise = ids[el.exercise.replaceAll(/\s|\./g, '')];
    delete el.no;
    delete el.optionA;
    delete el.optionB;
    delete el.optionC;
    delete el.correct;
    questionsConverted.push(el);
  });

  const questions = await Question.create(questionsConverted);

  res.status(200).json({
    status: 'success',
    exercises,
    questions,
  });
});

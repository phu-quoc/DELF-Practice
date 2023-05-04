const Exercise = require('../models/exerciseModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllExercises = factory.getAll(Exercise);
exports.getExercise = factory.getOne(Exercise, {
    path: 'questions',
});
exports.createExercise = factory.createOne(Exercise);
exports.deleteExercise = factory.deleteOne(Exercise);

exports.getExercisesOfExams = catchAsync(async (req, res, next) => {
    const exam_id = req.body.exam_id
    const listening_1 = await Exercise.find({ examination: exam_id, type: 'Listening 1' }).populate('questions')
    const listening_2 = await Exercise.find({ examination: exam_id, type: 'Listening 2' }).populate('questions')
    const listening_3 = await Exercise.find({ examination: exam_id, type: 'Listening 3' }).populate('questions')
    const reading_1 = await Exercise.find({ examination: exam_id, type: 'Reading 1' }).populate('questions')
    const reading_2 = await Exercise.find({ examination: exam_id, type: 'Reading 2' }).populate('questions')
    const reading_3 = await Exercise.find({ examination: exam_id, type: 'Reading 3' }).populate('questions')
    const writing = await Exercise.find({ examination: exam_id, type: 'Writing' }).populate('questions')

    res.status(200).json({
        status: 'success',
        listening_1: listening_1,
        listening_2: listening_2,
        listening_3: listening_3,
        reading_1: reading_1,
        reading_2: reading_2,
        reading_3: reading_3,
        writing: writing,
        // exercises: exercises
    });
});
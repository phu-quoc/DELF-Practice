const factory = require('./handlerFactory');
const Answer = require('../models/answerModel');
const catchAsync = require('../utils/catchAsync');
const Question = require('../models/questionModel');

exports.getAllAnswers = factory.getAll(Answer);
exports.getAnswer = factory.getOne(Answer);
exports.createAnswer = factory.createOne(Answer);
exports.deleteAnswer = factory.deleteOne(Answer);

exports.postAnswers = catchAsync(async (req, res, next) => {
    try {
        let answers = req.body.answers;
        answers = new Map(JSON.parse(answers))
        const result_id = req.body.result_id;
        let response = []

        for (const [question_id, option_id] of answers.entries()) {
            const question = await Question.findById(question_id)
            let mark = 0;
            
            question.options.forEach(option => {
                if (option_id == option._id && option.isCorrect == true) {
                    mark = question.point;
                    return 
                }
            });
            let newAnswer = await Answer.create({
                question: question_id,
                answer: option_id,
                result: result_id,
                mark: mark
            })
            response.push(newAnswer);
        }
        res.status(201).json({
            status: 'success',
            data: response,
        });
    } catch (error) {
        console.log(error);
    }
})

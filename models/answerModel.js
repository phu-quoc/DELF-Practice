const mongoose = require('mongoose');
const Result = require('./resultModel');
const Question = require('./questionModel');

const answerSchema = new mongoose.Schema({
  result: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Result',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  answer: String,
  mark: Number,
});

answerSchema.statics.calcTotalScore = async function (resultId) {
  const stats = await this.aggregate([
    {
      $match: {
        result: resultId,
      },
    },
    {
      $group: {
        _id: '$result',
        score: { $sum: '$mark' },
      },
    },
  ]);

  if (stats.length > 0)
    await Result.findByIdAndUpdate(resultId, { score: stats[0].score });
  else await Result.findByIdAndUpdate(resultId, { score: 0 });
};

answerSchema.pre('save', async function (next) {
  const question = await Question.findById(this.question);
  const correctAnswer = question.options.filter(
    option => option._id === this.answer && option.isCorrect === true
  );
  console.log('correctAnswer', correctAnswer.length);
  if (
    correctAnswer.length > 0 ||
    question.category === 'Speaking' ||
    question.category === 'Writing'
  )
    this.mark = question.point;
  else this.mark = 0;
  next();
});
answerSchema.post('save', async function () {
  await this.constructor.calcTotalScore(this.result);
});

answerSchema.pre(/^findOneAnd/, async function (next) {
  this.a = await this.findOne().clone();
  next();
});

answerSchema.post(/^findOneAnd/, async function () {
  console.log(`2 ${this.a}`);
  await this.a.constructor.calcTotalScore(this.a.result);
});

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;

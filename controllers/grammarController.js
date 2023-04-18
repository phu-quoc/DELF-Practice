const Grammar = require('../models/grammarModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.aliasTopGrammars = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-grammar';
  req.query.fields = 'grammar,content';
  next();
};

exports.getAllGrammars = factory.getAll(Grammar);
exports.getGrammar = factory.getOne(Grammar);
exports.createGrammar = factory.createOne(Grammar);
exports.updateGrammar = factory.updateOne(Grammar);
exports.deleteGrammar = factory.deleteOne(Grammar);

exports.getGrammarStats = catchAsync(async (req, res, next) => {
  const stats = await Grammar.aggregate([
    {
      $match: {
        grammar: {
          $gte: 0,
        },
      },
      $group: {
        _id: {
          $toUpper: '$grammar',
        },
        numGrammars: {
          $sum: 1,
        },
      },
      $sort: {
        grammar: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = Grammar.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates',
        },
        numGrammarStarts: {
          $sum: 1,
        },
        grammar: {
          $push: '$name',
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numGrammarStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

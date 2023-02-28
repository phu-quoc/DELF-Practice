const Grammar = require('../models/grammarModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopGrammars = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-grammar';
  req.query.fields = 'grammar,content';
  next();
};

exports.getAllGrammars = async (req, res) => {
  try {
    const features = new APIFeatures(Grammar.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const grammars = await features.query;
    res.status(200).json({
      status: 'success',
      results: grammars.length,
      data: {
        grammars,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getGrammar = async (req, res) => {
  try {
    const grammar = await Grammar.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        grammar,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createGrammar = async (req, res) => {
  try {
    const grammar = await Grammar.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        grammar: grammar,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateGrammar = async (req, res) => {
  try {
    const grammar = await Grammar.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        grammar: grammar,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteGrammar = async (req, res) => {
  try {
    await Grammar.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getGrammarStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

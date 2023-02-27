const Grammar = require('../models/grammarModel');

exports.getAllGrammars = async (req, res) => {
  try {
    const grammars = await Grammar.find();
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

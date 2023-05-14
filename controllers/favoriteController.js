const Favorite = require('../models/favoriteModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllFavorites = factory.getAll(Favorite);
exports.getFavorite = factory.getOne(Favorite);
exports.createFavorite = factory.createOne(Favorite);
exports.updateFavorite = factory.updateOne(Favorite);
exports.deleteFavorite = factory.deleteOne(Favorite);

const shuffleArray = arr => {
  const n = arr.length;
  const derangement = arr.slice();
  for (let i = n - 1; i > 0; i--) {
    // shuffles the array using the Fisher-Yates algorithm
    const j = Math.floor(Math.random() * (i + 1));
    [derangement[i], derangement[j]] = [derangement[j], derangement[i]];
  }
  // eslint-disable-next-line no-plusplus
  for (let i = n - 1; i >= 0; i--) {
    /**
     * swaps any elements that are still in their original position
     *  with a random element from the array.
     */
    if (derangement[i] === arr[i]) {
      const j = Math.floor(Math.random() * i);
      [derangement[i], derangement[j]] = [derangement[j], derangement[i]];
    }
  }
  return derangement;
};

exports.getRandom = catchAsync(async (req, res) => {
  try {
    const rdFarvorites = await Favorite.aggregate([
      {
        $sample: { size: 5 },
      },
    ]);
    let words = rdFarvorites.map(item => item.word);
    words = shuffleArray(words);
    res.status(200).json({
      status: 'success',
      data: {
        words: words,
        meanings: rdFarvorites,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

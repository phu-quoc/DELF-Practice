const Favorite = require('../models/favoriteModel')
const catchAsync = require('../utils/catchAsync');

exports.index = catchAsync(async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ 'userID': req.user._id })
        res.status(200).json({
            status: 'success',
            data: favorites
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
})

exports.create = catchAsync(async (req, res, next) => {
    try {
        const existedFavorite = await Favorite.find({ 'word': req.body.word })
        if (existedFavorite.length === 0) {
            const favorite = await Favorite.create({
                word: req.body.word,
                type: req.body.type,
                meaning: req.body.meaning,
                userID: req.user._id,
            })
            res.status(201).json({
                status: 'success',
                data: favorite
            })
        } else {
            res.status(200).json({
                status: 'success',
                data: existedFavorite
            })
        }
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
})

exports.delete = catchAsync(async (req, res, next) => {
    try {
        const favorite = await Favorite.findByIdAndRemove(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
})

exports.getRandom = catchAsync(async (req, res) => {
    try {
        const rdFarvorites = await Favorite.aggregate([{
            $sample: { size: 5 }
        }])
        let words = rdFarvorites.map((item) => item.word)
        words = shuffleArray(words)
        res.status(200).json({
            status: 'success',
            data: {
                words: words,
                meanings: rdFarvorites
            },
        });
    } catch (error) {
        console.log(error)
    }
})

const shuffleArray = (arr) => {
    const n = arr.length;
    const derangement = arr.slice();
    for (let i = n - 1; i > 0; i--) {
        // shuffles the array using the Fisher-Yates algorithm
        const j = Math.floor(Math.random() * (i + 1));
        [derangement[i], derangement[j]] = [derangement[j], derangement[i]];
    }
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
}
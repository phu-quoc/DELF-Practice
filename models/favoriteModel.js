const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    word: {
        type: String,
        required: [true, "Please provide vocabulary name"]
    },
    type: {
        type: String,
        required: [true, "Please provide word type"]
    },
    meaning: {
        type: String,
        required: [true, "Please provide word meaning"]
    },
    userID: {
        type: String,
        required: [true, "Please provide User ID"]
    }
})

const Favorite = mongoose.model('Favorite', favoriteSchema)
module.exports = Favorite
const express = require('express');
const authController = require('../controllers/authController');
const favoriteController = require('../controllers/favoriteController');
const router = express.Router();

router.route('/')
    .get(authController.protect, favoriteController.index)
    .post(authController.protect, favoriteController.create);
router.route('/:id')
    .delete(authController.protect, favoriteController.delete);
router.route('/random')
    .get(favoriteController.getRandom);
module.exports = router;

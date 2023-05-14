const express = require('express');

const favoriteController = require('../controllers/favoriteController');

const router = express.Router();

router
  .route('/')
  .get(favoriteController.getAllFavorites)
  .post(favoriteController.createFavorite);
router
  .route('/:id')
  .get(favoriteController.getFavorite)
  .delete(favoriteController.deleteFavorite);
router.route('/random').get(favoriteController.getRandom);
module.exports = router;

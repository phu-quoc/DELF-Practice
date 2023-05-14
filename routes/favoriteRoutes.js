const express = require('express');

const favoriteController = require('../controllers/favoriteController');

const router = express.Router();

router.get('/random', favoriteController.getRandom);
router
  .route('/')
  .get(favoriteController.getAllFavorites)
  .post(favoriteController.createFavorite);
router
  .route('/:id')
  .get(favoriteController.getFavorite)
  .delete(favoriteController.deleteFavorite);
module.exports = router;

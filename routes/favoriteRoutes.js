const express = require('express');

const authController = require('../controllers/authController');
const favoriteController = require('../controllers/favoriteController');

const router = express.Router();

router.get('/random', favoriteController.getRandom);
router.get(
  '/my-favorites',
  authController.protect,
  favoriteController.getMyFavorites
);
router
  .route('/')
  .get(favoriteController.getAllFavorites)
  .post(
    authController.protect,
    favoriteController.setUserId,
    favoriteController.createFavorite
  );
router
  .route('/:id')
  .get(favoriteController.getFavorite)
  .delete(favoriteController.deleteFavorite);
module.exports = router;

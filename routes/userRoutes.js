const express = require('express');
const passport = require('passport');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/google').get(authController.google);
router
  .route('/google/callback')
  .get(authController.googleCallback, authController.googleSuccess);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'vip'),
    userController.getAllUsers
  )
  .post(authController.protect, userController.createUser);
router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

module.exports = router;

const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const upload = require('./../utils/uploadImage');

const router = express.Router();

router.get('/logout', authController.logout);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:id', authController.resetPassword);
router.patch('/update-password', authController.grantAccess, authController.updatePassword);
router.patch('/update-me', authController.grantAccess, upload.uploadPhoto, upload.resizeImage, userController.updateMe);
router.delete('/delete-me', authController.grantAccess, userController.deleteMe);

router.use(authController.grantAccess, authController.restrictTo('admin'));

router.route('/')
    .get(userController.getAllUsers);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
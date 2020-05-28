const express = require('express');
const commentController = require('./../controllers/commentController');
const authController = require('./../controllers/authController');

const router = express.Router({
    mergeParams: true
});

router.route('/')
    .get(commentController.getAllComments)
    .post(authController.grantAccess, authController.restrictTo('user', 'admin'), commentController.createNewComment);

router.route('/:id')
    .get(commentController.getComment)
    .patch(authController.grantAccess, authController.restrictTo('user'), commentController.updateComment)
    .delete(authController.grantAccess, authController.restrictTo('admin'), commentController.deleteComment);

module.exports = router;
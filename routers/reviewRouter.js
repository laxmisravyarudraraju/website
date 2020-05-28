const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({
    mergeParams: true
});

router.route('/reviewStats').get(reviewController.reviewStats)

router.route('/')
    .get(authController.grantAccess, reviewController.getAllReviews)
    .post(authController.grantAccess, authController.restrictTo('user'), reviewController.createNewReview);

router.route('/:id')
    .get(reviewController.getReview)
    .delete(authController.grantAccess, authController.restrictTo('user', 'admin'), reviewController.deleteReview)
    .patch(reviewController.updateReview);

module.exports = router;
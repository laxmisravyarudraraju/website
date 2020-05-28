const express = require('express');

const authController = require('./../controllers/authController');
const couponController = require('./../controllers/couponController');

const router = express.Router();

router.route('/')
    .get(authController.grantAccess, couponController.getAllCoupons)
    .post(authController.grantAccess, authController.restrictTo('admin'), couponController.createNewCoupon);

router.route('/:id')
    .get(couponController.getCoupon)
    .patch(authController.grantAccess, couponController.updateCoupon)
    .delete(authController.grantAccess, authController.restrictTo('admin'), couponController.deleteCoupon);

module.exports = router;
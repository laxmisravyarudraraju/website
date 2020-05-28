const express = require('express');

const planController = require('./../controllers/planController');
const authController = require('./../controllers/authController');
const paymentController = require('./../controllers/paymentController');
const reviewRouter = require('./../routers/reviewRouter');
const orderRouter = require('./../routers/orderRouter');
const offerRouter = require('./../routers/offerRouter');

const router = express.Router();

// POST plans/:planId/reviews => create new review on tour with id
// GET plans/:planId/reviews => get all reviews on tour

router.use('/:slug/reviews', reviewRouter);
router.use('/:slug/orders', orderRouter);
router.use('/:slug/offers', offerRouter);

router.get('/:slug/checkout', authController.grantAccess, paymentController.buyPlan);

router.route('/')
    .get(planController.getAllPlans)
    .post(authController.grantAccess, authController.restrictTo('admin'), planController.createNewPlan);

router.route('/:id')
    .get(planController.getPlan)
    .patch(authController.grantAccess, authController.restrictTo('admin'), planController.updatePlan)
    .delete(authController.grantAccess, authController.restrictTo('admin'), planController.deletePlan);

module.exports = router;
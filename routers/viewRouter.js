const express = require('express');

const authController = require('./../controllers/authController');
const viewController = require('./../controllers/viewController');

const router = express.Router();

router.use(authController.isLoggedIn);
router.get('/home', viewController.renderHome);
router.get('/blogs', viewController.renderBlogs);
router.get('/signup', viewController.renderSignup);
router.get('/plans', viewController.renderPlans);
router.get('/plans/:slug', viewController.renderPlan);

router.get('/plans/:slug/checkout', viewController.renderCheckout);

router.get('/blogs/:slug', viewController.renderBlog);
router.get('/:name', viewController.renderUserDashboard);
router.get('/:name/orders', viewController.renderUserOrders);
router.get('/:name/settings', viewController.renderUserSettings);
router.get('/login', viewController.renderLogin);
router.get('/signup', viewController.renderSignup);
router.get('/:name/manageblogs', authController.grantAccess, authController.restrictTo('admin'), viewController.renderAddBlog);
router.get('/:name/manageblogs/editblogs', authController.grantAccess, authController.restrictTo('admin'), viewController.renderEditBlogs);
router.get('/:name/manageplans', authController.grantAccess, authController.restrictTo('admin'), viewController.renderManagePlans);
router.get('/:name/manageplans/createplan', authController.grantAccess, authController.restrictTo('admin'), viewController.renderAddPlan);
router.get('/:name/manageplans/editplan', authController.grantAccess, authController.restrictTo('admin'), viewController.renderEditPlan);

module.exports = router;
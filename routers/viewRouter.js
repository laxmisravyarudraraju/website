const express = require('express');

const viewController = require('./../controllers/viewController');

const router = express.Router();

router.get('/', viewController.renderHome);
router.get('/projects', viewController.renderBlogs);
router.get('/experience', viewController.renderPlans);
router.get('/plans/:slug', viewController.renderPlan);


router.get('/projects/:slug', viewController.renderBlog);

module.exports = router;
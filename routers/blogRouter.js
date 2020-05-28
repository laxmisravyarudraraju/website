const express = require('express');
const blogController = require('./../controllers/blogController');
const authController = require('./../controllers/authController');

const commentRouter = require('./commentRouter');
const likeRouter = require('./likeRouter');

const router = express.Router();

// router.use('/:blogId/comments', commentRouter);
router.use('/:slug/comments', commentRouter);

// router.use('/:blogId/likes', likeRouter);
router.use('/:slug/likes', likeRouter);

router.route('/')
    .get(blogController.getAllBlogs)
    .post(authController.grantAccess, authController.restrictTo('admin', 'developer', 'designer'), blogController.createNewBlog);

router.route('/:id')
    .get(blogController.getBlog)
    .patch(authController.grantAccess, authController.restrictTo('admin', 'developer', 'designer'), blogController.updateBlog)
    .delete(authController.grantAccess, authController.restrictTo('admin'), blogController.deleteBlog);

module.exports = router;
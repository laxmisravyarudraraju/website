const Like = require('./../models/likeModel');
const catchAsync = require('./../utils/catchAsync');
const handlerFactory = require('./../utils/handlerFactory');
const Blog = require('./../models/blogModel');

exports.getAllLikes = catchAsync(handlerFactory.findAllHandler(Like));
exports.createNewLike = catchAsync(async (req, res, next) => {
    const dataObj = {
        ...req.body
    };
    if (req.params.slug) {
        const blog = await Blog.findOne({
            slug: req.params.slug
        });
        dataObj.blog = blog._id;
    };
    // if (req.params.blogId) dataObj.blog = req.params.blogId;
    dataObj.user = req.user || res.locals.user;
    const like = await Like.create(dataObj);
    res.status(200).json({
        status: "success",
        like
    });
});
exports.getLike = catchAsync(handlerFactory.findOneHandler(Like));
exports.deleteLike = catchAsync(async (req, res, next) => {
    const dataObj = {};
    if (req.params.slug) {
        const blog = await Blog.findOne({
            slug: req.params.slug
        });
        dataObj.blog = blog._id;
    };
    // if (req.params.blogId) dataObj.blog = req.params.blogId;
    dataObj.user = req.user || res.locals.user;
    await Like.findOneAndDelete(dataObj);
    res.status(200).json({
        status: "success"
    });
});
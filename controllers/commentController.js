const express = require('express');
const mongoose = require('mongoose');
const Comment = require('./../models/commentModel');
const catchAsync = require('./../utils/catchAsync');
const handlerFactory = require('./../utils/handlerFactory');
const Blog = require('./../models/blogModel');

exports.getAllComments = catchAsync(handlerFactory.findAllHandler(Comment));
exports.getComment = catchAsync(handlerFactory.findOneHandler(Comment));
exports.updateComment = catchAsync(handlerFactory.updateHandler(Comment));
exports.deleteComment = catchAsync(handlerFactory.deleteHandler(Comment));
// exports.createNewComment = catchAsync(handlerFactory.createHandler(Comment));

exports.createNewComment = catchAsync(async (req, res, next) => {
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
    const comment = await Comment.create(dataObj);
    res.status(200).json({
        status: "success",
        comment
    });
});
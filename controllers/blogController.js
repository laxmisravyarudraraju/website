const express = require('express');
const mongoose = require('mongoose');

const Blog = require('./../models/blogModel');

const catchAsync = require('./../utils/catchAsync');
const handlerFactory = require('./../utils/handlerFactory');

exports.getAllBlogs = catchAsync(handlerFactory.findAllHandler(Blog));

exports.getBlog = catchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate({
        path: 'author',
        select: 'name photo role'
    }).populate('comments');

    blog.calculateViews();

    res.status(200).json({
        "status": "success",
        blog
    });
});

exports.updateBlog = catchAsync(handlerFactory.updateHandler(Blog));
exports.deleteBlog = catchAsync(handlerFactory.deleteHandler(Blog));
exports.createNewBlog = catchAsync(handlerFactory.createHandler(Blog));
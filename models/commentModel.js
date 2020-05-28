const mongoose = require('mongoose');

const Blog = require('./../models/blogModel');

const commentSchema = mongoose.Schema({
    blog: {
        type: mongoose.Schema.ObjectId,
        ref: 'Blog'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    comment: {
        type: String,
        required: [true, 'Please Enter Your Comment.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

commentSchema.index({
    user: 1,
    blog: 1
}, {
    unique: true
});

commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
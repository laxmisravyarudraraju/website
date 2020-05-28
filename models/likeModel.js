const mongoose = require('mongoose');
const Blog = require('./../models/blogModel');

const likeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    blog: {
        type: mongoose.Schema.ObjectId,
        ref: 'Blog'
    }
});

likeSchema.index({
    user: 1,
    blog: 1
}, {
    unique: true
});

likeSchema.statics.calculateLikes = async function (blogId) {
    const likes = await this.aggregate([{
        $match: {
            blog: blogId
        },
    }, {
        $group: {
            _id: "$blog",
            likes: {
                $sum: 1
            }
        }
    }]);
    if (likes[0]) {
        await Blog.findByIdAndUpdate(blogId, {
            likes: likes[0].likes
        }, {
            new: true
        });
    } else {
        await Blog.findByIdAndUpdate(blogId, {
            likes: 0
        }, {
            new: true
        });
    }
}

likeSchema.post('save', function () {
    this.constructor.calculateLikes(this.blog);
});

likeSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});

likeSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calculateLikes(this.r.blog);
})

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
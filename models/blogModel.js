const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 120
    },
    image: String,
    summary: {
        type: String,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        minlength: 500
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    collections: {
        type: Array,
        default: ["related"]
    },
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

blogSchema.pre('save', function (next) {
    this.slug = slugify(this.title, {
        lower: true
    });
    next();
});

blogSchema.methods.calculateViews = async function () {
    this.views++;
    await this.save();
}

blogSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'blog'
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
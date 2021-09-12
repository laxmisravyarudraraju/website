const fs = require('fs');
const mongoose = require('mongoose');
const Plan = require('./../models/planModel');
const User = require('./../models/userModel');
const Review = require('./../models/reviewModel');
const Coupon = require('./../models/couponModel');
const Blog = require('./../models/blogModel');
const Comment = require('./../models/commentModel');
const Like = require('./../models/likeModel');
const Order = require('./../models/orderModel');

require('dotenv').config({
    path: './../config.env'
});

// connect atlas cloud db to app
mongoose.connect(process.env.DB_URL.replace('<password>', process.env.DB_PASSWORD), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB CONNECTION SUCCESSFUL!!!'));

const plans = JSON.parse(fs.readFileSync(`${__dirname}/plans.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf8'));
const coupons = JSON.parse(fs.readFileSync(`${__dirname}/coupons.json`, 'utf8'));
const blogs = JSON.parse(fs.readFileSync(`${__dirname}/blog.json`, 'utf8'));
const comments = JSON.parse(fs.readFileSync(`${__dirname}/comments.json`, 'utf8'));
const likes = JSON.parse(fs.readFileSync(`${__dirname}/likes.json`, 'utf8'));


const importData = async () => {
    try {
        // await Plan.create(plans);
        // await User.create(users);
        // await Review.create(reviews);
        // await Coupon.create(coupons);
        // await Blog.create(blogs);
        await Comment.create(comments);
        // await Like.create(likes);
        console.log('data loaded successfully');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

const deleteData = async () => {
    try {
        // await Plan.deleteMany();
        // await User.deleteMany();
        // await Review.deleteMany();
        // await Coupon.deleteMany();
        // // await Blog.deleteMany();
        await Comment.deleteMany();
        // await Like.deleteMany();
        // await Order.deleteMany();
        console.log('deleted..');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

if (process.argv[2] === '--import') {
    importData();
} else {
    deleteData();
}
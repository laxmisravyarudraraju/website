const axios = require('axios');
const Blog = require('./../models/blogModel');
const Like = require('./../models/likeModel');
const Plan = require('./../models/planModel');
const Offer = require('./../models/offerModel');
const Order = require('./../models/orderModel');
const User = require('./../models/userModel');
const apiFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.renderHome = (req, res) => {
    res.status(200).render('home', {
        title: 'Sravya | Web Development'
    });
};

exports.renderBlogs = async (req, res) => {
    const query = apiFeatures(req.query, Blog)
    const blogs = await query.sort('-createdAt');
    res.status(200).render('blogs', {
        blogs,
        title: 'Sravya | Blogs'
    });
};

exports.renderSignup = async (req, res) => {
    res.status(200).render('signup', {
        title: 'Sravya | Sign Up'
    });
};

exports.renderPlans = async (req, res) => {
    const query = apiFeatures(req.query, Plan);
    const plans = await query;
    res.status(200).render('plans', {
        plans,
        title: 'Sravya | Plans'
    })
}

exports.renderPlan = catchAsync(async (req, res) => {
    const plan = await Plan.findOne({
        slug: req.params.slug
    }).populate('reviews').populate({
        path: 'coupons',
        select: 'name offerPercentage offerValidFor'
    });
    let isReviewed = false,
        offer;
    if (plan.reviews && res.locals.user) {
        plan.reviews.forEach(el => {
            if (JSON.stringify(el.user._id) === JSON.stringify(res.locals.user._id)) {
                isReviewed = true;
            }
        })
    }
    if (res.locals.user) {
        offer = await Offer.findOne({
            plan: plan._id,
            user: res.locals.user._id
        }).populate('availableCoupons') || await Offer.create({
            plan: plan._id,
            user: res.locals.user._id
        }).populate('availableCoupons');
    }

    res.status(200).render('plan', {
        plan,
        offer,
        isReviewed,
        title: `Sravya | Plans | ${plan.slug}`
    });
})

exports.renderBlog = async (req, res) => {
    const blog = await Blog.findOne({
        slug: req.params.slug
    }).populate('comments').populate({
        path: 'author',
        select: 'name photo role'
    });
    let like;
    if (res.locals.user) {
        like = await Like.findOne({
            blog: blog._id,
            user: res.locals.user._id
        });
    }
    await blog.calculateViews();
    res.status(200).render('blog', {
        blog,
        like,
        title: `Sravya | Blogs | ${blog.slug}`
    });
}

exports.renderUserDashboard = async (req, res) => {
    let plan;
    const order = await Order.find({
        user: res.locals.user._id
    }).sort('-orderPlaced').limit(1);
    if (order[0]) {
        plan = await Plan.findById(order[0].plan._id).populate({
            path: 'supervisedBy',
            select: 'name role photo'
        })
    }
    const blog = await Blog.find().sort('-createdAt').limit(1);
    res.status(200).render('user', {
        heading: 'Dashboard',
        order: order[0],
        plan,
        blog: blog[0]
    });
}

exports.renderUserOrders = async (req, res) => {
    const orders = await Order.find({
        user: res.locals.user._id
    }).sort('-orderPlaced');
    res.status(200).render('user_orders', {
        heading: 'Orders',
        orders
    });
}

exports.renderUserSettings = async (req, res) => {
    res.status(200).render('user_settings', {
        heading: 'Settings'
    });
}

exports.renderLogin = async (req, res) => {
    res.status(200).render('user', {
        title: 'Sravya | My Account'
    });
}

exports.renderManagePlans = async (req, res) => {
    res.status(200).render('manage_plans', {
        heading: 'manage plans'
    });
}

exports.renderAddPlan = async (req, res) => {
    res.status(200).render('add_plan', {
        heading: 'add plan'
    });
}

exports.renderEditPlan = async (req, res) => {
    const query = apiFeatures(req.query, Plan);
    const plans = await query;
    res.status(200).render('edit_plans', {
        plans,
        heading: 'Edit Plans'
    });
}

exports.renderEditBlogs = async (req, res) => {
    const blogs = await Blog.find().sort('-createdAt')
    res.status(200).render('edit_blogs', {
        blogs,
        heading: 'Edit Blogs'
    });
}

exports.renderAddBlog = async (req, res) => {
    res.status(200).render('manage_blogs', {
        heading: 'Add blog'
    });
}

exports.renderCheckout = async (req, res) => {
    res.status(200).render('buy', {
        heading: 'Checkout'
    })
}
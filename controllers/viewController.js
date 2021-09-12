const apiFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const projects = require('./../models/projectModel');

exports.renderHome = (req, res) => {
    res.status(200).render('home', {
        title: 'Sravya | Web Development'
    });
};

exports.renderBlogs = async (req, res) => {
    // const query = apiFeatures(req.query, Blog)
    // const blogs = await query.sort('-createdAt');
    res.status(200).render('projects', {
        projects,
        title: 'Sravya | Projects'
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
    let projectFilter = [];
    projectFilter = projects.filter(el => el.slug === req.params.slug);
    const project = projectFilter[0];
    res.status(200).render('project', {
        project,
        title: `Sravya | Blogs | ${project.slug}`
    });
}
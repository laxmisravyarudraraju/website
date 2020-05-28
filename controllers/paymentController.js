const stripe = require('stripe')(process.env.STRIPE_SECRET);

const catchAsync = require('./../utils/catchAsync');

const Plan = require('./../models/planModel');

exports.buyPlan = catchAsync(async (req, res, next) => {
    const plan = await Plan.findOne({
        slug: req.params.slug
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.host}:8000/home`,
        cancel_url: `${req.protocol}://${req.hostname}:8000/plans/${plan.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.slug,
        line_items: [{
            name: `Plan: ${plan.name.toUpperCase()}`,
            description: plan.description,
            amount: plan.price * 100,
            currency: 'usd',
            quantity: 1
        }]
    });

    res.status(200).json({
        status: "success",
        session
    });

});
const mongoose = require('mongoose');

const Offer = require('./offerModel');
const Coupon = require('./couponModel');
const Plan = require('./planModel');
const AppError = require('./../utils/appError');

const orderSchema = mongoose.Schema({
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: 'Plan'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    coupon: {
        type: mongoose.Schema.ObjectId,
        ref: 'Coupon'
    },
    orderPrice: Number,
    orderPlaced: {
        type: Date,
        default: Date.now()
    },
    deliveryDate: Date
});

orderSchema.pre('save', async function (next) {
    let offer = await Offer.findOne({
        plan: this.plan,
        user: this.user
    });
    const plan = await Plan.findById(this.plan);
    this.deliveryDate = this.orderPlaced.getTime() + plan.duration * 24 * 60 * 60 * 1000;
    if (!offer) offer = await Offer.create({
        plan: this.plan,
        user: this.user
    });
    if (!offer.availableCoupons.includes(this.coupon)) return next(new AppError('This Coupon is Unavailable for this Plan, Try another one.', 404));
    const coupon = await Coupon.findById(this.coupon);
    if (coupon) this.orderPrice = (plan.price - plan.price * coupon.offerPercentage);
    else this.orderPrice = plan.price;
    next();
});

orderSchema.post('save', async function (next) {
    const offer = await Offer.findOne({
        plan: this.plan
    });
    if (offer.availableCoupons.includes(this.coupon)) {
        const index = offer.availableCoupons.indexOf(this.coupon);
        offer.availableCoupons.splice(index, 1);
    }
    await offer.save({
        validateBeforeSave: false
    });
});

orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'plan',
        select: 'name price duration category supervisedBy'
    }).populate({
        path: 'user',
        select: 'name photo'
    }).populate('coupon');

    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order
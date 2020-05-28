const mongoose = require('mongoose');

const Plan = require('./planModel');

const offerSchema = mongoose.Schema({
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: 'Plan'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    availableCoupons: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Coupon'
    }]
});

offerSchema.index({
    user: 1,
    plan: 1
}, {
    unique: true
});

offerSchema.pre('save', async function (next) {
    if (this.isNew) {
        const plan = await Plan.findById(this.plan);
        this.availableCoupons = plan.coupons;
        return next();
    }
    next();
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
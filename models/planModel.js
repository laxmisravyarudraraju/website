const mongoose = require('mongoose');
const slugify = require('slugify');

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        message: "A plan must have a name"
    },
    summary: String,
    description: {
        type: String,
        required: true,
        message: "A Plan must have a description"
    },
    price: {
        type: Number,
        required: true,
        message: "A Plan must have a price"
    },
    maxPages: {
        type: Number,
        default: 3,
    },
    category: {
        type: String,
        default: 'UI / UX',
    },
    database: {
        type: Number,
        default: 0
    },
    duration: Number,
    supervisedBy: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    avgRating: {
        type: Number,
        default: 4.5
    },
    slug: String,
    numRatings: Number,
    numCustomers: Number,
    totalProjects: Number,
    numCompleted: Number,
    coupons: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Coupon'
    }],
    technologyUsed: Array
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

planSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true
    });
    next();
});

planSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'plan'
});

planSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'plan'
})

// planSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'supervisedBy',
//         select: 'name role'
//     });
//     next();
// });

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
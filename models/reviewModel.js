const mongoose = require('mongoose');

const Plan = require('./../models/planModel');

const reviewSchema = mongoose.Schema({
    rating: {
        type: Number,
        default: 4.5,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: [true, 'A review can not be empty']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: 'Plan'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

reviewSchema.statics.calculateAvgRatings = async function (planId) {
    const stats = await this.aggregate([{
        $match: {
            plan: planId
        }
    }, {
        $group: {
            _id: "$plan",
            avgRating: {
                $avg: "$rating"
            },
            numRatings: {
                $sum: 1
            }
        }
    }]);
    await Plan.findByIdAndUpdate(planId, {
        avgRating: stats[0].avgRating.toFixed(1),
        numRatings: stats[0].numRatings
    });
}

reviewSchema.index({
    plan: 1,
    user: 1
}, {
    unique: true
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
})

reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calculateAvgRatings(this.r.plan);
})

reviewSchema.post('save', function () {
    this.constructor.calculateAvgRatings(this.plan);
})

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    }).sort('-createdAt');
    // .populate({
    //     path: 'plan',
    //     select: 'name'
    // })
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
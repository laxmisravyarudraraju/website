const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A coupon must have a name'],
        uppercase: true,
        unique: true
    },
    offerPercentage: {
        type: Number,
        required: [true, 'A coupon must have an offer value']
    },
    offerValidFor: {
        type: Number,
        required: [true, 'A coupon must have a validity Period']
    },
    offerStartDate: {
        type: Date,
        default: Date.now()
    },
    offerActive: {
        type: Boolean,
        default: true,
        select: false
    },
    offerEndDate: Date
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

couponSchema.pre('save', function (next) {
    if (!this.isModified('offerStartDate')) return next();
    this.offerEndDate = this.offerStartDate.getTime() + this.offerValidFor * 24 * 60 * 60 * 1000;
    next();
});

couponSchema.pre('save', function (next) {
    if (Date.now() > this.offerEndDate) this.offerActive = false;
    next();
});

couponSchema.pre(/^find/, function (next) {
    this.find({
        offerActive: true,
        offerStartDate: {
            $lte: Date.now()
        }
    });
    next();
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
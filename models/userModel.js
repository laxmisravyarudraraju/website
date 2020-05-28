const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid Email Address, Please Try Again.']
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: function () {
            return this.password === this.confirmPassword;
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: true
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

// userSchema.set('toJSON', {
//     virtuals: true
// });

// userSchema.virtual('createdAt').get(function () {
//     return Date.now();
// });

userSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'user'
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({
        active: true
    });
    next();
});

userSchema.methods.correctPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
};

userSchema.methods.passwordChangedAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimeStamp < changedTimeStamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256')
        .update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

userSchema.methods.passwordExpired = function () {
    return Date.now > this.passwordResetExpires;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
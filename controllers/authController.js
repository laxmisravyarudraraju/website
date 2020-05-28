const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const Email = require('./../utils/sendEmail');

const authJWT = (id) => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN
    });
};

const sendJWTToken = (user, res) => {
    const token = authJWT(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    user.active = undefined;
    res.status(200).json({
        status: "success",
        token,
        user
    });
}

exports.login = catchAsync(async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    if (!email || !password) return next(new AppError('Please Provide your Email and Password.', 404));
    const user = await User.findOne({
        email
    }).select('+password');
    if (!user) return next(new AppError('Incorrect Email Address, Try Again.', 404));
    const match = await user.correctPassword(password);
    if (match) {
        sendJWTToken(user, res);
    } else {
        return next(new AppError('Incorrect Password, Try Again.', 404))
    }
});

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: req.body.passwordChangedAt
    });
    if (!user) next(new AppError('Something went wrong', 404));
    await new Email(user, '/api/v1/users/login').sendWelcome()
    sendJWTToken(user, res);
});

exports.grantAccess = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) return next(new AppError('Please Log In to get access.', 404));
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('User no longer exists', 404));
    if (user.passwordChangedAfter(decoded.iat)) return next(new AppError('Password Changed Recently, Login with new Password.'), 404);
    req.user = user;
    next();
});

exports.logout = catchAsync(async (req, res, next) => {
    if (req.cookies.jwt) {
        res.cookie('jwt', '', {
            expires: new Date(Date.now() + 5 * 1000)
        });
        res.status(200).json({
            status: "success",
            message: "Logged Out Successfully"
        })
    }
    next(new AppError('Please Login again to continue', 400));
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
    if (req.cookies.jwt) {
        const decoded = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return next();
        if (user.passwordChangedAfter(decoded.iat)) return next();
        req.user = user;
        res.locals.user = user;
        return next();
    }
    next();
});

exports.restrictTo = (...users) => {
    return (req, res, next) => {
        if (!users.includes(req.user.role)) return next(new AppError('You are not permitted to access this route.', 404));
        next();
    }
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    if (!req.body.email) return next(new AppError('Please Provide Your email address.'), 404);
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) return next(new AppError('User with provided email address does not exist, Please try again.'));
    const token = user.createPasswordResetToken();
    await user.save({
        validateBeforeSave: false
    });
    const resetURL = `http://127.0.0.1:8000/api/v1/users/reset-password/${token}`;

    await new Email(user, resetURL).sendResetPassword()

    res.status(200).json({
        status: "success",
        message: "Reset token sent to your registered email address."
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const token = req.params.id;
    const receivedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: receivedToken
    });
    if (!user) return next(new AppError('Invalid Reset Token, Please Try Again.', 404));
    if (user.passwordExpired()) return next(new AppError('Reset Token Expired, Please Try Again.', 404));
    const {
        password,
        confirmPassword
    } = req.body;
    if (!password || !confirmPassword) return next(new AppError('Please Provide Both Fields(Password, Confirm Password', 404));

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    sendJWTToken(user, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.correctPassword(req.body.currentPassword))) return next(new AppError('Your Current Password is Incorrect, Please try again.', 404));
    if (req.body.currentPassword === req.body.newPassword) return next(new AppError('Your New Password and Old Password must not be the same', 404));
    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    sendJWTToken(user, res);
});
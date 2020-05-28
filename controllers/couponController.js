const Coupon = require('./../models/couponModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllCoupons = catchAsync(async (req, res, next) => {
    const coupons = await Coupon.find().select('-offerActive');
    res.status(200).json({
        status: "success",
        coupons
    });
});

exports.getCoupon = catchAsync(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);
    res.status(200).json({
        status: "success",
        coupon
    });
});

exports.createNewCoupon = catchAsync(async (req, res, next) => {
    const coupon = await Coupon.create(req.body);
    res.status(200).json({
        status: "success",
        coupon
    });
});

exports.updateCoupon = catchAsync(async (req, res, next) => {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
    res.status(200).json({
        status: "success",
        coupon
    });
});

exports.deleteCoupon = catchAsync(async (req, res, next) => {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success"
    });
});
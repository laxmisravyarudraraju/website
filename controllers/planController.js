const Plan = require('./../models/planModel');
const apiFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const handlerFactory = require('./../utils/handlerFactory');

exports.getAllPlans = catchAsync(async (req, res, next) => {
    // const query = new apiFeatures(req.query, Plan).filter().sort().query;
    const docs = await Plan.find().populate('reviews').populate({
        path: 'coupons',
        select: 'name offerPercentage offerValidFor'
    }).populate('orders').populate({
        path: 'supervisedBy',
        select: 'name role'
    });

    res.status(200).json({
        "status": "success",
        data: docs
    });
})

exports.getPlan = catchAsync(async (req, res, next) => {
    const doc = await Plan.findById(req.params.id).populate('reviews').populate({
        path: 'coupons',
        select: 'name offerPercentage offerValidFor'
    }).populate('orders').populate({
        path: 'supervisedBy',
        select: 'name role'
    });

    res.status(200).json({
        "status": "success",
        data: doc
    });
})

exports.updatePlan = catchAsync(handlerFactory.updateHandler(Plan));
exports.deletePlan = catchAsync(handlerFactory.deleteHandler(Plan));
exports.createNewPlan = catchAsync(handlerFactory.createHandler(Plan));
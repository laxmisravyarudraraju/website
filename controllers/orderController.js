const catchAsync = require('./../utils/catchAsync');
const handlerFactory = require('./../utils/handlerFactory');

const Plan = require('./../models/planModel');
const Order = require('./../models/orderModel');

exports.getAllOrders = catchAsync(handlerFactory.findAllHandler(Order));
exports.getOrder = catchAsync(handlerFactory.findOneHandler(Order));

exports.createNewOrder = catchAsync(async (req, res, next) => {
    let dataObj = {
        ...req.body
    };

    if (req.params.slug) dataObj.plan = (await Plan.findOne({
        slug: req.params.slug
    }))._id;

    if (req.user) dataObj.user = req.user;

    const order = await Order.create(dataObj);
    res.status(200).json({
        status: "success",
        order
    });
});

exports.updateOrder = catchAsync(handlerFactory.updateHandler(Order));
exports.deleteOrder = catchAsync(handlerFactory.deleteHandler(Order));
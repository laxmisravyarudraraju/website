const catchAsync = require('./../utils/catchAsync');
const handlerFactory = require('./../utils/handlerFactory');

const Plan = require('./../models/planModel');
const Offer = require('./../models/offerModel');

exports.getAllOffers = catchAsync(handlerFactory.findAllHandler(Offer, 'availableCoupons'));
exports.getOffer = catchAsync(handlerFactory.findOneHandler(Offer, 'availableCoupons'));

exports.createNewOffer = catchAsync(async (req, res, next) => {
    let dataObj = {
        ...req.body
    };

    if (req.params.slug) dataObj.plan = (await Plan.findOne({
        slug: req.params.slug
    }))._id;

    if (req.user) dataObj.user = req.user;

    const offer = await Offer.create(dataObj);
    res.status(200).json({
        status: "success",
        offer
    });
});

exports.updateOffer = catchAsync(handlerFactory.updateHandler(Offer));
exports.deleteOffer = catchAsync(handlerFactory.deleteHandler(Offer));
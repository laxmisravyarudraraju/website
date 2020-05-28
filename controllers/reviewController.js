const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const handlerFactory = require('./../utils/handlerFactory');
const Plan = require('./../models/planModel');

const filter = async (req) => {
    const filterObj = {
        ...req.body
    };
    if (req.params.slug) {
        const plan = await Plan.findOne({
            slug: req.params.slug
        });
        filterObj.plan = plan._id;
    }
    return filterObj;
}

exports.createNewReview = catchAsync(async (req, res, next) => {
    const filterObj = await filter(req);
    filterObj.user = req.user._id;
    const review = await Review.create(filterObj);
    res.status(201).json({
        status: "success",
        review
    });
})

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const filterObj = filter(req);
    const reviews = await Review.find(filterObj);
    res.status(200).json({
        status: "success",
        reviews
    })
})

exports.getReview = catchAsync(handlerFactory.findOneHandler(Review));
exports.updateReview = catchAsync(handlerFactory.updateHandler(Review));
exports.deleteReview = catchAsync(handlerFactory.deleteHandler(Review));

exports.reviewStats = catchAsync(async (req, res, next) => {
    const stats = await Review.aggregate([{
        $group: {
            _id: "$plan",
            count: {
                $sum: 1
            },
            avgRating: {
                $avg: "$rating"
            }
        }
    }]);

    res.status(200).json({
        status: 'success',
        stats
    })
})
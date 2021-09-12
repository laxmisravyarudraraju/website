const Experience = require('./../models/experienceModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllExperiences = catchAsync(async (req, res, next) => {
    const docs = Experience;

    res.status(200).json({
        "status": "success",
        data: docs
    });
})
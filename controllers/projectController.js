const Projects = require('../models/projectModel');

const catchAsync = require('../utils/catchAsync');

exports.getAllProjects = catchAsync(async (req, res, next) => {
    const docs = Projects;

    res.status(200).json({
        "status": "success",
        data: docs
    });
});

exports.getProject = catchAsync(async (req, res) => {
    const project = Projects.filter(el => el.slug === req.params.slug);
    console.log(project);
    res.status(200).json({
        "status": "success",
        project
    });
});
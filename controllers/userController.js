const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const handlerFactory = require('./../utils/handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.getAllUsers = catchAsync(handlerFactory.findAllHandler(User, 'orders'));
exports.getUser = catchAsync(handlerFactory.findOneHandler(User, 'orders'));
exports.updateUser = catchAsync(handlerFactory.updateHandler(User));
exports.deleteUser = catchAsync(handlerFactory.updateHandler(User));
exports.createNewUser = catchAsync(handlerFactory.createHandler(User));

exports.updateMe = catchAsync(async (req, res, next) => {
    console.log(req.file);
    if (req.body.password || req.body.confirmPassword) return next(new AppError('You cannot update password here, Please try /update-password route', 404));
    const filteredObj = filterObj(req.body, 'name', 'email', 'photo');
    if (req.file) filteredObj.photo = req.file.filename;
    const user = await User.findByIdAndUpdate(req.user._id, filteredObj, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: "success",
        user
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        active: false
    });

    res.status(200).json({
        status: "success",
        user
    })
});
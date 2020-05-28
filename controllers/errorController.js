const AppError = require('./../utils/appError');

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = `${err.statusCode}`.startsWith('4') ? 'fail' : 'error';

    // if (err.statusCode === 500) err = miscError(err);

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    }
};

const miscError = (err) => {
    if (err.code === 11000) {
        message = 'Already Submitted with this Username';
        statusCode = 400
    } else if (err.name === 'ValidationError') {
        message = err.message.split(': ').splice(-1);
        statusCode = 400
    } else if (err.name === 'CastError') {
        message = 'Not Found';
        statusCode = 400
    } else {
        message = err.message || 'Something went wrong';
        statusCode = err.statusCode || 500;
    }
    return new AppError(message, statusCode);
}
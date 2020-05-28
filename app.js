const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const planRouter = require('./routers/planRouter');
const blogRouter = require('./routers/blogRouter');
const userRouter = require('./routers/userRouter');
const reviewRouter = require('./routers/reviewRouter');
const couponRouter = require('./routers/couponRouter');
const commentRouter = require('./routers/commentRouter');
const likeRouter = require('./routers/likeRouter');
const viewRouter = require('./routers/viewRouter');
const orderRouter = require('./routers/orderRouter');
const offerRouter = require('./routers/offerRouter');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

const app = express();

// middlewares
app.use(express.json({
    limit: '10kb'
}));
app.use(cookieParser());

// a) third party middlewares - morgan
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 1200
}));

app.use(xss());

// set pug view engine
app.set('view engine', 'pug');
// set path to render static templates
app.set('views', path.join(__dirname, 'views'));
// to render static files
app.use(express.static(path.join(__dirname, 'dist')));

// mounting route middlewares
app.use('/', viewRouter);
app.use('/api/v1/plans', planRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/coupons', couponRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/offers', offerRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`cannot find path ${req.originalUrl}`, 404));
});

app.use(errorController);

module.exports = app;

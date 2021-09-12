const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const experienceRouter = require('./routers/experienceRouter');
const projectRouter = require('./routers/projectRouter');

const viewRouter = require('./routers/viewRouter');

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
app.use('/api/v1/experience', experienceRouter);
app.use('/api/v1/projects', projectRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`cannot find path ${req.originalUrl}`, 404));
});

app.use(errorController);

module.exports = app;

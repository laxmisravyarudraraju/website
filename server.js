// handle uncaught exceptions which occur synchronously
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!!! Shutting Down...')
    console.log(err.name, err.message);
    process.exit(1)
})

// load custom process.env variables
require('dotenv').config({
    path: './config.env'
});

const app = require('./app');
const mongoose = require('mongoose');

// connect atlas cloud db to app
mongoose.connect(process.env.DB_URL.replace('<password>', process.env.DB_PASSWORD), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB CONNECTION SUCCESSFUL!!!'));

const port = process.env.PORT || 3000;

// start server
const server = app.listen(port, () => console.log(`Listening to the port ${port}...`));

// handle unhandled rejection errors which happen asynchronously
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION!!! Shutting Down...');
    server.close(() => {
        process.exit(1);
    })
})
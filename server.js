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
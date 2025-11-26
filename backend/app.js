var express = require('express');
var logger = require('morgan');
const fs = require("fs");
const https = require("https");

var planRouter = require("./src/v1/routes/plan-router")
var declareRouter = require("./src/v1/routes/declare-router")
var reservationRouter = require('./src/v1/routes/reservation-router');
var reservationPeriodRouter = require('./src/v1/routes/reservation-period.router')
var courseRouter = require('./src/v1/routes/course-router');
var app = express();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/v1/study-plans', planRouter);
app.use('/v1/students', declareRouter);
app.use('/v1/students', reservationRouter);
app.use('/v1', courseRouter);
app.use('/v1', reservationPeriodRouter);
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
    // Production: HTTPS
    const options = {
        key: fs.readFileSync("/etc/ssl/server.key"),
        cert: fs.readFileSync("/etc/ssl/server.crt")
    };
    https.createServer(options, app).listen(3443, () => {
        console.log("Backend HTTPS running on port 3443 (TLS 1.3 only)");
    });
} else {
    // Local: HTTP
    app.listen(3000, () => {
        console.log("Backend HTTP running on port 3000");
    });
}

module.exports = app;

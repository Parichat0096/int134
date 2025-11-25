var express = require('express');
var logger = require('morgan');
const fs = require("fs");
const https = require("https");

// var cors = require('cors');

var planRouter = require("./src/v1/routes/plan-router")
var declareRouter = require("./src/v1/routes/delacre-router")

var app = express();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors())

// Routes
app.use('/v1/study-plans', planRouter);
app.use('/v1/students', declareRouter);

// TLS 1.3 only
const options = {
    key: fs.readFileSync("/etc/ssl/server.key"),
    cert: fs.readFileSync("/etc/ssl/server.crt"),
    // secureProtocol: "TLSv1_3_method"  // Force TLS 1.3
};

// http
// app.listen(3000, () => {
//     console.log("Backend HTTP running on port 3000");
// });


// Start HTTPS server
https.createServer(options, app).listen(3443, () => {
    console.log("Backend HTTPS running on port 3443 (TLS 1.3 only)");
});

module.exports = app;

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const apiRouter = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

const TEAM_CODE = process.env.TEAM_CODE || 'ft';
const APP_BASE_PATH = `/intproj25/${TEAM_CODE}/itb-ecors`;
app.get('/test', (req, res) => {
    res.send({ status: 'API Base Server is working' });
});
app.use(`${APP_BASE_PATH}/api/v1`, apiRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
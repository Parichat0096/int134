const express = require('express');
const router = express.Router();
const studyPlansRouter = require('./studyPlans.router');

router.use('/study-plans', studyPlansRouter);

module.exports = router;
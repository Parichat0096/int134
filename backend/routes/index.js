const express = require('express');
const router = express.Router();
const studyPlansRouter = require('./studyPlans.router');
const studentsRouter = require('./students.router');

router.use('/study-plans', studyPlansRouter);
router.use('/students', studentsRouter);

module.exports = router;
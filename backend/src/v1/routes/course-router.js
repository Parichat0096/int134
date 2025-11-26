var express = require('express');
var router = express.Router();
var controller = require('../controllers/course-controller.js');

// Routes สำหรับ Course & Plan Support
router.get('/course-offerings-plans', controller.getCourseOfferingsPlans);
router.get('/plan-courses', controller.getPlanCourses);

module.exports = router;
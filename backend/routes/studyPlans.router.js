const express = require('express');
const router = express.Router();
const studyPlansController = require('../controllers/studyPlans.controller');

router.get('/', studyPlansController.getStudyPlans);

module.exports = router;
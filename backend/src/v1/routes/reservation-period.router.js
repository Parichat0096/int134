var express = require('express');
var router = express.Router();
var controller = require('../controllers/reservation-period-controller.js');

// PBI-11: GET /reservation-periods
router.get('/reservation-periods', controller.getPeriods);

module.exports = router;
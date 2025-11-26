var express = require('express');
var router = express.Router();
var controller = require('../controllers/reservation-controller.js');

// Routes สำหรับ Reservations
router.get('/:studentId/reservations', controller.listReservations);
router.post('/:studentId/reservations', controller.createReservation);
router.delete('/:studentId/reservations/:courseOfferingId', controller.removeReservation);
module.exports = router;
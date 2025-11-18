const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/students.controller');
router.get('/:studentId/declared-plan', studentsController.getDeclaredPlan);
router.post('/:studentId/declared-plan', studentsController.declarePlan);
router.put('/:studentId/declared-plan', studentsController.changePlan);
router.delete('/:studentId/declared-plan', studentsController.cancelPlan);

module.exports = router;
var express = require('express');
var router = express.Router();
var controller = require('../controllers/declare-controller.js')

router.get('/:id/declared-plan', controller.getById)
router.post('/:id/declared-plan', controller.adddeclare)
router.put('/:id/declared-plan', controller.changeDeclared)
router.delete('/:id/declared-plan', controller.deleteDeclared)

module.exports = router;
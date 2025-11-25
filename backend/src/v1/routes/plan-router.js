var express = require('express');
var router = express.Router();
const controller = require("../controllers/plan-controller")

router.get('/',controller.list)

module.exports = router;
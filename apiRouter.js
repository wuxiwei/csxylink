var express = require('express');

//var scheduleController = require('./api/schedule');
//var gradeController = require('./api/grade');
var index = require('./api/login');
var router = express.Router();

//router.post('/schedule', scheduleController.fetch);

//router.post('/grade', gradeController.fetch);

router.post('/', index.login);

module.exports = router;

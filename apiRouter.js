var express = require('express');

var scheduleController = require('./api/schedule'); //引入路由处理函数js文件
var gradeController = require('./api/grade');
var loginController = require('./api/login');
var router = express.Router();

router.post('/schedule', scheduleController.fetch); //根据url访问文件名找js文件的处理方法
router.post('/grade', gradeController.fetch);

router.post('/login', loginController.login);

module.exports = router;


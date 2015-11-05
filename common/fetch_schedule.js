var request = require('superagent');
var agent = require('./simulate_login');
var ScheduleProxy = require('../proxy').Schedule;
var tools = require('./tools');
var scheduleParser = require('../common/parse_schedule');

var fetchSchedule = function(username, password, term, callback) {
	agent.login(username, password, function(err, name, Cookies) {
		if (err) {
			return callback(new Error('School network connection failure'));
		} else {
			ScheduleProxy.getScheduleByUsername(username, term, function(err1, schedule1) {
				if (err1) {
					console.log(err1.message+'fetch_schedule');
				}
				if (!schedule1) { //数据库中不存在该学号或存在该学号但是不存在课表信息，都成立。
					//如果不存在则，新建一个课表为空的该学号信息；如果存在但课表不存在，则没有变化。
					ScheduleProxy.newAndSave(username, function(err2) {
						if (err2) {
							console.log(err2.message+'fetch_schedule');
						}
					});
				}
				var _req = request.post('http://cityjw.dlut.edu.cn:7001/ACTIONQUERYSTUDENTSCHEDULEBYSELF.APPPROCESS').type('form').send({
					'YearTermNO': term
				});
				_req.set('Cookie', Cookies);
				_req.parse(tools.encodingparser).end(function(_err2, _res) {
					if (_err2) { //请求课表数据出错
						return callback(new Error('request schedule error'));
					}
					var html = _res.text;
					schedule = scheduleParser.parse(html);
					schedule = JSON.stringify(schedule);
					ScheduleProxy.UpdateScheduleByUsername(username, schedule, term, function(err3) {
						if (err3) { //更新课表数据出错
							return callback(new Error('update schedule error'));
						}
					});
					return callback(null, name, schedule);
				});
			});
		}
	});
};

exports.fetchSchedule = fetchSchedule;


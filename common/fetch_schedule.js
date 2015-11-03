var request = require('superagent');
var agent = require('./simulate_login');
var ScheduleProxy = require('../proxy').Schedule;
var tools = require('./tools');
var scheduleParser = require('../common/parse_schedule');

var fetchSchedule = function(username, password, term, callback) {
  agent.login(username, password, function(err, name, Cookies) {
    if (err) {
      return callback(new Error('School network connection failure'));
    } else { var _req = request.post('http://cityjw.dlut.edu.cn:7001/ACTIONQUERYSTUDENTSCHEDULEBYSELF.APPPROCESS')
        .type('form')
        .send({
          'YearTermNO': term
        });
        _req.set('Cookie', Cookies);
        _req.parse(tools.encodingparser).end(function(_err2, _res) {
        if (_err2) {  //请求课表数据出错
         return callback(new Error('request schedule error'));
        }
        var html = _res.text;
        var schedule = scheduleParser.parse(html);
        schedule = JSON.stringify(schedule);
        ScheduleProxy.UpdateScheduleByUsername(username, schedule, term, function(err3){
          if(err3){  //更新课表数据出错
            return callback(new Error('update schedule error'));
          }
        });
        return callback(null, name, schedule);
      });
    }
  });
};

exports.fetchSchedule = fetchSchedule;

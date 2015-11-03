var _ = require('lodash');
var request = require('superagent');
var fetchSchedule = require('../common/fetch_schedule').fetchSchedule;
var ScheduleProxy = require('../proxy').Schedule;
var UserProxy = require('../proxy').User;
var config = require('../config');


var fetch = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
	var term = config.term_schedule;    //后台获取学期（每学期后台手动更改）

  // first query from db to save time.
  ScheduleProxy.getScheduleByUsername(username, term, function(err, schedule, user){
    // user does not exist or other errors
    if(err){
      switch(err.message){
        case 'The schedule does not exist.':   //数据库内不存在
          console.log("The schedule does not exist.");
          break;
        default: next(err);    //将错误发送至上一层（用法不明）
      }
    }
    if(schedule){
      res.json(_.extend({
        'status': 'ok'
      }, {
        'name': user.name
      }, {
        'schedule': JSON.parse(schedule.schedule)
      }));
    } else {
      // does not exist in db, fetch from network
      fetchSchedule(username, password, term, function(err2, name, schedule1){
        if(err2){
          switch(err2.message){
            case 'School network connection failure':
              res.json({
                'status': 'School network connection failure'
              });
            break;
            case 'error':
              res.json({
                'status': 'internal error'
              });
            break;
          }
        } else {
          schedule1 = JSON.parse(schedule1);
          res.json(_.extend({
            'status': 'ok'
          }, {
            'name': name
          }, {
            'schedule': schedule1
          }));
        }
      });
    }
  });
};

exports.fetch = fetch;

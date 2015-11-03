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
  ScheduleProxy.getScheduleByUsername(username, term, function(err, schedule){
    // user does not exist or other errors
    if(err){
      switch(err.message){
        case 'The schedule does not exist.':   //数据库内不存在
          console.log("The schedule does not exist.");
          break;
        default: next(err);
      }
    }
    if(schedule){
      UserProxy.getUserByUsername(username, function(err1, user){
        res.json(_.extend({
          'status': 'ok'
        }, {
          'name': user.name
        }, {
          'schedule': JSON.parse(schedule.schedule)
        }));
      });
    } else {
      // does not exist in db, fetch from network
      fetchSchedule(username, password, term, function(err2, name, schedule1){
        if(err2){
          switch(err2.message){
            case 'login failed':
              res.json({
                'status': 'login failed'
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
          }, {
            'term': term
          }));
        }
      });
    }
  });
};

exports.fetch = fetch;

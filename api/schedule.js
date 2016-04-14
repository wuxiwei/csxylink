var _ = require('lodash');
var request = require('superagent');
var fetchSchedule = require('../common/fetch_schedule').fetchSchedule;
var ScheduleProxy = require('../proxy').Schedule;

var fetch = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var action = req.body.action;       //区分客户端请求：取课表与改课表(get & update)

  // if(typeof(username)=="undefined" || typeof(password)=="undefined" || typeof(action)=="undefined"){
  if(typeof(username)=="undefined" || username=="" || username==null || typeof(password)=="undefined" || password=="" || password==null){
		 res.json({
       'status': 'School network connection failure'
		 });
  }else{
    if(action == "get"){
      // first query from db to save time.
      ScheduleProxy.getScheduleByUsername(username, function(err, schedule){
        // user does not exist or other errors
        if(err){
          switch(err.message){
            case 'The schedule does not exist.':   //数据库内不存在该学号信息
              //console.log("The schedule does not exist.");
              break;
            default: next(err);    //将错误发送至上一层（用法不明）
          }
        }
        
        if (schedule) { //数据库中存在该学号并且存在课表信息。
          res.json(_.extend({
            'status': 'ok'
          },{
            'schedule': JSON.parse(schedule)
          }));
        } else {
          scheduleaction(res, username, password);
        }
      });
    }else if(action == "update"){
      scheduleaction(res, username, password);
    }
  }
};

function scheduleaction(res, username, password){
  fetchSchedule(username, password, function(err2, name, schedule1){
    if(err2){
      switch(err2.message){
        case 'School network connection failure':
          res.json({
            'status': 'School network connection failure'
          });
        break;
        default:
		    	res.json({
		    		'status':
		    		'internal error' //内部错误
		    	});
      }
    } else {
      res.json(_.extend({
        'status': 'ok'
      }, {
        'name': name
      }, {
        'schedule': JSON.parse(schedule1)
      }));
    }
  });
}

exports.fetch = fetch;

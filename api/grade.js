var _ = require('lodash');
var request = require('superagent');
var fetchGrade = require('../common/fetch_grade').fetchGrade;
var GradeProxy = require('../proxy').Grade;

var fetch = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var termstring = req.body.termstring;    //取得查成绩的时间段字符串
  var action = req.body.action; //区分客户端请求：取成绩与改成绩(get & update)
  if(action == "get"){
    // first query from db to save time.
    GradeProxy.getGradeByUsernameAndTermstring(username, termstring, function(err, grade){
      // user does not exist or other errors
      if(err){
        switch(err.message){
          case 'The grade does not exist.':
            console.log("The grade does not exist.");
            break;
          default: next(err);
        }
      }

      if(grade){
        res.json(_.extend({
          'status': 'ok'
        },{
          'grade': JSON.parse(grade)
        }));
      } else {
        gradeaction(res, username, password, termstring);
      }
    });
  }else if(action == "update"){
    gradeaction(res, username, password, termstring);
  }
};

function gradeaction(res, username, password, termstring){
  fetchGrade(username, password, termstring, function(err2, name, grade1){
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
        'grade': JSON.parse(grade1)
      }));
    }
  });
}

exports.fetch = fetch;

var _ = require('lodash');
var request = require('superagent');
var fetchGrade = require('../common/fetch_grade').fetchGrade;
var GradeProxy = require('../proxy').Grade;
var UserProxy = require('../proxy').User;
var term_grade = require('../config').term_grade;     //获取成绩查询配置表


var fetch = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var termstring = req.body.termstring;    //取得查成绩的时间段字符串
  var term = 1;

  for (x in termstring)
  {
    if(term_grade[x] == termstring){      //根据时间串定官网term序号
      term = Number(x);
    }
  }

          //console.log(term);
          //return;
  // first query from db to save time.
  GradeProxy.getGradeByUsername(username, term, function(err, grade, user){
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
      }, {
        'name': user.name
      }, {
        'grade': JSON.parse(grade.grade)
      }));
    } else {
      // does not exist in db, fetch from network
      fetchGrade(username, password, term, function(err2, name, grade1){
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
          grade1 = JSON.parse(grade1);
          res.json(_.extend({
            'status': 'ok'
          }, {
            'name': name
          }, {
            'grade': grade1
          }));
        }
      });
    }
  });
};

exports.fetch = fetch;


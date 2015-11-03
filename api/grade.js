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
      term = Number(x)+1;
    }
  }

  // first query from db to save time.
  GradeProxy.getGradeByUsername(username, term, function(err, grade){
    // user does not exist or other errors
    if(err){
      switch(err.message){
        case 'The grade does not exist.':break;
        default: next(err);
      }
    }
    if(grade){
      UserProxy.getUserByUsername(username, function(err1, user){
        res.json(_.extend({
          'status': 'ok'
        }, {
          'name': user.name
        }, {
          'grade': JSON.parse(grade.grade)
        }, {
          'term': term
        }));
      });
    } else {
      // does not exist in db, fetch from network
      fetchGrade(username, password, term, function(err2, name, grade1){
        if(err2){
          switch(err2.message){
            case 'login failed':
              res.json({
                'status': 'login failed'
              });
            break;
            case 'error':
              res.json({
                'status': 'login failed'
              });
            break;
          }
        } else {
          grade1 = JSON.parse(grade1);
          res.json(_.extend({
            'status': 'ok'
          }, {
            'name': name
          }, {
            'grade': grade1
          }, {
            'term': term
          }));
        }
      });
    }
  });
};

exports.fetch = fetch;

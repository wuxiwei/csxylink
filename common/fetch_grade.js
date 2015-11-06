var request = require('superagent');
var agent = require('./simulate_login');
var GradeProxy = require('../proxy').Grade;
var tools = require('./tools');
var gradeParser = require('./parse_grade');
var term_grade = require('../config').term_grade;     //获取成绩查询配置表

var fetchGrade = function(username, password, termstring, callback) {
	agent.login(username, password, function(err, name, Cookies) {
		if (err) {
			return callback(new Error('School network connection failure'));
		} else {

      var term = 1;
      for (x in term_grade)
      {
        if(term_grade[x] == termstring){      //根据时间串定官网term序号,用来获取校网数据
          term = Number(x)+1;
        }
      }

			GradeProxy.getGradeByUsernameAndTermstring(username, termstring, function(err1, grade1) {
				if (err1) {
					console.log(err1.message+'fetch_grade');
				}
        if (!grade1) { //数据库中不存在该学号任何信息成立。
          //如果不存在，则新建一个成绩为空的该学号信息。
          GradeProxy.newAndSave(username, termstring, function(err2) {
            if (err2) {
              console.log(err2.message+'fetch_grade');
            }
          });
        }

				var _req = request.post('http://cityjw.dlut.edu.cn:7001/ACTIONQUERYSTUDENTSCORE.APPPROCESS').type('form').send({
					'YearTermNO': term
				});
				_req.set('Cookie', Cookies);
				_req.parse(tools.encodingparser).end(function(_err2, _res) {
					if (_err2) { //请求成绩数据出错
						return callback(new Error('School network connection failure'));
					}
					var html = _res.text;
					var grade = gradeParser.parse(html);
					grade = JSON.stringify(grade);
					GradeProxy.UpdateGradeByUsername(username, grade, termstring, function(err3) {
						if (err3) { //更新成绩数据出错
              console.log(err3.message+'fetch_grade');
						}
					});
				return callback(null, name, grade);
				});
			});
		}
	});
};

exports.fetchGrade = fetchGrade;


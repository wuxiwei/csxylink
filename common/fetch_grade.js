var request = require('superagent');
var agent = require('./simulate_login');
var GradeProxy = require('../proxy').Grade;
var tools = require('./tools');
var gradeParser = require('./parse_grade');


var fetchGrade = function(username, password, term, callback) {
  agent.login(username, password, function(err, name, Cookies) {
    if (err) {
      return callback(new Error('School network connection failure'));
    } else {
      var _req = request.post('http://cityjw.dlut.edu.cn:7001/ACTIONQUERYSTUDENTSCORE.APPPROCESS')
        .type('form')
        .send({
          'YearTermNO': term
        });
        _req.set('Cookie', Cookies);
        _req.parse(tools.encodingparser).end(function(_err2, _res) {
        if (_err2) {  //请求成绩数据出错
         return callback(new Error('request grade error'));
        }
        var html = _res.text;
        var grade = gradeParser.parse(html);
        grade = JSON.stringify(grade);
        GradeProxy.UpdateGradeByUsername(username, grade, term, function(err3){
          if(err3){  //更新成绩数据出错
            return callback(new Error('update grade error'));
          }
        });
        return callback(null, name, grade);
      });
    }
  });
};

exports.fetchGrade = fetchGrade;

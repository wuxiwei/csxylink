var _ = require('lodash');
var models = require('../models');
var Grade = models.Grade;

//成绩连接数据库操作

exports.getGradeByUsernameAndTermstring = function (username, termstring, callback) {
  var query = Grade.findOne({username:username, termstring:termstring});
  query.select('grades');
  query.exec(function(err, grade){

    if (err) {
      return callback(new Error('The database does error'));
    }
    if (!grade) {
      return callback(new Error('The grade does not exist.'));
    }else{
      return callback(null, grade.grades);
    }
    
  });
};

exports.UpdateGradeByUsername = function(username, grade, termstring, callback){
  var conditions = {username : username, termstring: termstring};
  var update     = {$set : {grades: grade}};
  var options    = {upsert : true};
  Grade.update(conditions, update, options, function(err){
    if(err) {
      return callback(err);
    }
  });
};

exports.newAndSave = function (username, termstring, callback) {
  var grade = new Grade();
  grade.username = username;
  grade.termstring = termstring;
  grade.save(function(err){
    if(err){
      return callback(err);
      //return callback(new Error('newAndSave error'));
    } else {
      return callback(null);
    }
  });
};

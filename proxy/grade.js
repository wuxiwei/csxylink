var _ = require('lodash');
var models = require('../models');
var Grade = models.Grade;
var User = require('./user');
var UserProxy = require('../proxy').User;

//成绩连接数据库操作

exports.getGradeByUsername = function (username, term, callback) {
  Grade.findOne({username: username}, function(err1, grade){
    if (err1) {
      return callback('The database does error');
    }
    if (!grade) {
      return callback(new Error('The grade does not exist.'));
    }
    var idx = _.findIndex(grade.grades, {term: term});
    if(idx==-1){
      return callback(null, null);
    } else {
      var rv = grade.grades[idx];
      return callback(null, rv);
    }
  });
};

exports.UpdateGradeByUsername = function(username, grade, term, callback){
  Grade.findOne({username: username}, function(err1, grade1){
    if (err1) {
      return callback(err1);
    }
    if (!grade1) {
      return callback(new Error('The grade does not exist.'));
    }
    var idx = _.findIndex(grade.grades, {term: term});
    if(idx==-1){
      grade1.grades.push({grade: grade, term: term});
      grade1.markModified('grades');
      grade1.save(callback);
    } else {
      callback(null);
    }
  });
};

exports.newAndSave = function (username, callback) {
  var grade = new Grade();
  grade.username = username;
  grade.save(function(err){
    if(err){
      return callback(new Error('newAndSave error'));
    } else {
      return callback(null);
    }
  });
};

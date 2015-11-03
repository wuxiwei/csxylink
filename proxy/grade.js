var _ = require('lodash');
var models = require('../models');
var Grade = models.Grade;
var User = require('./user');
var UserProxy = require('../proxy').User;


exports.getGradeByUsername = function (username, term, callback) {
    UserProxy.getUserByUsername(username, function(err, user){
    if(err){
      return callback(err);
    }
    if(user){
      Grade.findOne({user: user._id}, function(err1, grade){
        if (err1) {
          return callback(err1);
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
    } else {
      return callback(null, null);
    }
  });
};

exports.UpdateGradeByUsername = function(username, grade, term, callback){
    UserProxy.getUserByUsername(username, function(err, user){
    if(err){
      return callback(err);
    }
    if(user){
      Grade.findOne({user: user._id}, function(err1, grade1){
        if (err1) {
          return callback(err);
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
    }
  });
};

exports.newAndSave = function (user, callback) {
  var grade = new Grade();
  grade.user = user;
  grade.save(function(err){
    if(err){
      return callback(err);
    } else {
      return callback(null, grade._id);
    }
  });
};

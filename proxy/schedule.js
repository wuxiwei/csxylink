var _ = require('lodash');
var models = require('../models');
var Schedule = models.Schedule;
var User = require('./user');
var UserProxy = require('../proxy').User;


exports.getScheduleByUsername = function (username, term, callback) {
  UserProxy.getUserByUsername(username, function(err, user){
    if(err){
      return callback(err);
    }
    if(user){
      Schedule.findOne({user: user._id}, function(err1, schedule){
        if (err1) {
          return callback(err1);
        }
        if (!schedule) {
          return callback(new Error('The schedule does not exist.'));
        }
        var idx = _.findIndex(schedule.schedules, {term: term});
        if(idx==-1){
          return callback(null, null);
        } else {
          var rv = schedule.schedules[idx];
          return callback(null, rv);
        }
      });
    } else {
      return callback(null, null);
    }
  });
};

exports.UpdateScheduleByUsername = function(username, schedule, term, callback){
  UserProxy.getUserByUsername(username, function(err, user){
    if(err){
      return callback(err);
    }
    if(user){
      Schedule.findOne({user: user._id}, function(err1, schedule1){
        if (err1) {
          return callback(err);
        }
        if (!schedule1) {
          return callback(new Error('The schedule does not exist.'));
        }
        var idx = _.findIndex(schedule.schedules, {term: term});
        if(idx==-1){
          schedule1.schedules.push({schedule: schedule, term: term});
          schedule1.markModified('schedules');
          schedule1.save(callback);
        } else {
          callback(null);
        }
      });
    }
  });
};

exports.newAndSave = function (user, callback) {
  var schedule = new Schedule();
  schedule.user = user;
  schedule.save(function(err){
    if(err){
      return callback(err);
    } else {
      return callback(null, schedule._id);
    }
  });
};

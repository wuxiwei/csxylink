var _ = require('lodash');
var models = require('../models');
var Schedule = models.Schedule;
var User = require('./user');
var UserProxy = require('../proxy').User;

//课表连接数据库操作

exports.getScheduleByUsername = function (username, term, callback) {
  Schedule.findOne({username: username}, function(err1, schedule){
    if (err1) {
      return callback(new Error('The database does error'));
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
};

exports.UpdateScheduleByUsername = function(username, schedule, term, callback){
  Schedule.findOne({username: username}, function(err1, schedule1){
    if (err1) {
      return callback(err1);
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
};

exports.newAndSave = function (username, callback) {
  var schedule = new Schedule();
  schedule.username = username;
  schedule.save(function(err){
    if(err){
      return callback(new Error('newAndSave error'));
    } else {
      return callback(null);
    }
  });
};

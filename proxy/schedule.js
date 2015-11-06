var _ = require('lodash');
var models = require('../models');
var Schedule = models.Schedule;

//课表连接数据库操作

exports.getScheduleByUsername = function (username, callback) {
  var query = Schedule.findOne({username:username});
  query.select('schedules');
  query.exec(function(err,schedule){

    if (err) {
      return callback(new Error('The database does error'));
    }
    if (!schedule) {
      return callback(new Error('The schedule does not exist.'));
    }else{
      return callback(null, schedule.schedules);
    }
    
  });
};

exports.UpdateScheduleByUsername = function(username, schedule, callback){
  var conditions = {username : username};
  var update     = {$set : {schedules : schedule}};
  var options    = {upsert : true};
  Schedule.update(conditions, update, options, function(err){
    if(err) {
      return callback(err);
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

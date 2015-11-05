var models = require('../models');
var User = models.User;

//学生信息连接数据库操作

exports.getUserByUsername = function (username, callback) {
  User.findOne({'username': username}, callback);
};

exports.UpdateUserPassword = function(username, password, callback){
  var conditions = {username : username};
  var update     = {$set : {password : password}};
  var options    = {upsert : true};
  User.update(conditions, update, options, function(err){
    if(err) {
      return callback(err);
    }
  });
};

exports.newAndSave = function (name, username, password, callback) {
  var user = new User();
  user.name = name;
  user.username = username;
  user.password = password;
  user.save(function(err){
    if(err){
      return callback(new Error('newAndSave error'));
    } else {
      return callback(null);
    }
  });
};

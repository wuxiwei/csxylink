var models = require('../models');
var User = models.User;

//学生信息连接数据库操作

exports.getUserByUsername = function (username, callback) {
  User.findOne({'username': username}, callback);
};

//exports.getUsersByLoginName = function (Loginname, callback) {
  //User.find({'username': Loginname}, callback);
//};



exports.newAndSave = function (name, username, password, callback) {
  var user = new User();
  user.name = name;
  user.username = username;
  user.password = password;
  user.save(function(err){
    if(err){
      return callback(err);
    } else {
      return callback(null, user._id);
    }
  });
};

var request = require('superagent');
var agent = require('./simulate_login');
var UserProxy = require('../proxy').User;
var tools = require('./tools');
//var loginParser = require('../common/parse_login');

var fetchLogin = function(username, password, callback){
  agent.login(username,password,function(err,name,Cookies){
    if(err){

      return callback(new Error('login failed'));
    }else{
     return callback(null, name, Cookies);
    }
});
};

exports.fetchLogin = fetchLogin;

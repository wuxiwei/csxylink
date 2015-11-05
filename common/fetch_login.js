var request = require('superagent');
var agent = require('./simulate_login');
var UserProxy = require('../proxy').User;
var fetchLogin = function(username, password, callback) {
	agent.login(username, password, function(err, name, Cookies) {
		if (err) {
			if (err.message == "School network connection failure") {
        return callback(new Error('School network connection failure'));
      }else{
        return callback(new Error('login failed'));
      }
		} else {
			UserProxy.getUserByUsername(username, function(err1, user) {
				if (err1) {
					console.log(err1.message+'fetch_login');
				}
				if (!user) {
					UserProxy.newAndSave(name, username, password, function(err2) {
						if (err2) {
							console.log(err2.message+'fetch_login');
						}
          });
        }else{
          UserProxy.UpdateUserPassword(username,password,function(err3) {
          	if (err2) {
							console.log(err2.message+'fetch_login');
						}
          });
        }
      });
			return callback(null, name);
		}
	});
};

exports.fetchLogin = fetchLogin;

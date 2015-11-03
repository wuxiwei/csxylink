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
			return callback(null, name);
		}
	});
};

exports.fetchLogin = fetchLogin;

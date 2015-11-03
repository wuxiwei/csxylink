var _ = require('lodash');
var fetchLogin = require('../common/fetch_Login').fetchLogin;
var UserProxy = require('../proxy').User;
var config = require('../config');

var login = function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var term = config.current_term;

	UserProxy.getUserByUsername(username, function(err, user) {
		if (user) {
			res.json(_.extend({
				'status': 'ok'
			},
			{
				'man': user.name
			}));
		} else {
			fetchLogin(username, password, function(err2, name, Login) {
				if (err2) {
					switch (err2.message) {
					case 'login failed':
						res.json({
							'status':
							'login failed'
						});
						break;
					case 'error':
						res.json({
							'status':
							'internal error'
						});
						break;
					}
				} else {

					res.json(_.extend({
						'status':
						'yes'
					},
					{
						'man': name
					}));
				}
			})
		}
	});
};
exports.login = login;

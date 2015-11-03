var _ = require('lodash');
var fetchLogin = require('../common/fetch_login').fetchLogin;
var UserProxy = require('../proxy').User;
var config = require('../config');

var login = function(req, res, next) {
	var username = req.body.username; //获取学号
	var password = req.body.password; //获取密码
	var term = config.current_term; //后台获取学期（每学期后台手动更改）
	UserProxy.getUserByUsername(username, function(err, user) {
		if (user) { //如果数据库存在直接返回
			res.json(_.extend({
				'status': 'ok'
			},
			{
				'man': user.name
			}));
		} else {
			fetchLogin(username, password, function(err2, name) { //模拟登陆入口,返回姓名
				if (err2) {
					switch (err2.message) {
				    case 'login failed':
				    	res.json({
				    		'status':
				    		'login failed'
				    	});
				    	break;
				    case 'School network connection failure':
				    	res.json({
				    		'status':
                'School network connection failure'  //校网出错
				    		//'internal error' //内部错误
				    	});
				    	break;
            default:
				    	res.json({
				    		'status':
				    		'internal error' //内部错误
				    	});
					}
				} else {
					res.json(_.extend({
						'status':
						'ok'
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


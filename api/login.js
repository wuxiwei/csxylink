var _ = require('lodash');
var fetchLogin = require('../common/fetch_login').fetchLogin;
var UserProxy = require('../proxy').User;
var config = require('../config');

var login = function(req, res, next) {
	var username = req.body.username; //获取学号
	var password = req.body.password; //获取密码
  if(typeof(username)=="undefined" || typeof(password)=="undefined"){
		 res.json({
		 	'status':
		 	'login failed'        //帐号密码出错
		 });
  }else{
    UserProxy.getUserByUsername(username, function(err, user) {
      if (user) { //如果数据库存在直接返回
        if(user.password == password){
          res.json(_.extend({
            'status': 'ok'
          },
          {
            'man': user.name
          }));
        }else{
          loginaction(res, username, password);
        }
      } else {
          loginaction(res, username, password);
      }
    });
  }
};

function loginaction(res, username, password){
	fetchLogin(username, password, function(err2, name) { //模拟登陆入口,返回姓名
		if (err2) {
			switch (err2.message) {
		    case 'login failed':
		    	res.json({
		    		'status':
		    		'login failed'        //帐号密码出错
		    	});
		    	break;
		    case 'School network connection failure':
		    	res.json({
		    		'status':
            'School network connection failure'  //校网出错
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
				'man': name       //成功返回姓名
			}));
		}
	})
}
exports.login = login;


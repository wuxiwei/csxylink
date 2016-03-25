var request = require('superagent');
var _request = request('request');
var cheerio = require('cheerio');
var nodecr = require('nodecr');
var EventProxy = require('eventproxy');
var UserProxy = require('../proxy').User;
var ScheduleProxy = require('../proxy').Schedule;
var GradeProxy = require('../proxy').Grade;
var tools = require('./tools');
var fs = require('fs');

//模拟官网登陆
function login(username, password, callback) {
	var loginUrl = 'http://cityjw.dlut.edu.cn:7001/ACTIONLOGON.APPPROCESS?mode=4';
	var validateImgUrl = 'http://cityjw.dlut.edu.cn:7001/ACTIONVALIDATERANDOMPICTURE.APPPROCESS';

	var Cookies;

	//initial session here
	request.get(loginUrl).end(function(err, res) {
		if (err) {
      //console.log("School network connection failure");
			return callback(new Error('School network connection failure'));
		}
		Cookies = res.headers['set-cookie'].pop().split(';')[0]; //获取该会话cookie
		//request validation image
		var req = request.get(validateImgUrl); //获取验证码图片
		req.set('Cookie', Cookies); //设置cookie，保证同一个会话验证码
		req.end(function(err1, res1) {
			if (err1) {
				return callback(err1);
			}
      //可以找更好的处理图片解析验证码包
			var s64 = Buffer(res1.body).toString('base64'); //将获取数据流转为buffer后再转为base64编码数据流
			base64_decode(s64, 'image/'+username+'.jpg'); //函数实现将base64编码数据流转为.jpg格式图片到本目录下
			nodecr.process('image/'+username+'.jpg', function(err2, result) { //nodecr包实现对图片解析得到验证码
				if (err2) {
					return callback(new Error('Error image analysis'));
				} else {
          //console.log("图片验证码");
					//simulate login
					var req2 = request.post(loginUrl).type('form'); //表单提交实现伪登陆
					req2.set('Cookie', Cookies);
          console.log(username+"+++"+Cookies);
					var params = {
						'WebUserNO': username.toString(),
						'Password': password.toString(),
						'Agnomen': result.substring(0, 4),
						'submit.x': '0',
						'submit.y': '0'
					};
					req2.send(params).parse(tools.encodingparser).end(function(err3, res3) {
						if (err3) {
              return callback(new Error('School network connection failure'));
						}
						if (res3.text.indexOf('Logout') != - 1) {      //登陆成功
							var $ = cheerio.load(res3.text);
							var name = $('td[align=left]').text();
							return callback(null, name, Cookies);
						} else {
							//console.log('sssssssssssssssssss' + result.substring(0, 4) + "=" + username + "=" + password);
							return callback(new Error('login failed'));
						}
					});
				}
			});
		});
	});
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
	// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
	var bitmap = new Buffer(base64str, 'base64');
	// write buffer to file
	fs.writeFileSync(file, bitmap);
}

module.exports = {
	'login': login
};


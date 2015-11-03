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
  request.get(loginUrl)
    .end(function(err, res) {
      if (err) {
        return callback(err);
      }
      Cookies = res.headers['set-cookie'].pop().split(';')[0];       //获取该会话cookie
      //request validation image
      var req = request.get(validateImgUrl);
      req.set('Cookie', Cookies);
      req.end(function(err1, res1) {
        if (err1) {
          return callback(err1);
        }
        var s64 = Buffer(res1.body).toString('base64');
        base64_decode(s64,'1.jpg');
        nodecr.process('./1.jpg', function(err2, result) {
          if (err2) {
            return callback(err2);
          } else {
            //simulate login
            var req2 = request.post(loginUrl).type('form');
            req2.set('Cookie', Cookies);
            var params = {
              'WebUserNO': username.toString(),
              'Password': password.toString(),
              'Agnomen': result.substring(0,4),
              'submit.x': '0',
              'submit.y': '0'
            };
            req2.send(params)
              .parse(tools.encodingparser)
              .end(function(err3, res3) {
                if (err3) {
                  return callback(err3);
                }
                if (res3.text.indexOf('Logout') != -1) {
                  var $ = cheerio.load(res3.text);
                  var name = $('td[align=left]').text();
                  // if user not in mongodb then insert the user into db
                  UserProxy.getUserByUsername(username, function(err4, user){
                    if(err4){console.log(err4);}
                    if(!user){
                      UserProxy.newAndSave(name, username, password, function(err5, savedUser){
                        if(err5){
                          return callback(err5);
                        } else {
                          var ep = EventProxy.create('schedule', 'grade', function(err6, err7){
                            if(err6){
                              return callback(err6);
                            }
                            if(err7){
                              return callback(err7);
                            }
                          });
                          ScheduleProxy.newAndSave(savedUser, function(_err){
                            if(_err){
                              ep.emit('schedule', _err);
                            }
                          });
                          GradeProxy.newAndSave(savedUser, function(_err){
                            if(_err){
                              ep.emit('grade', _err);
                            }
                          });
                        }
                      });
                    }
                  });
                  return callback(null, name, Cookies);
                } else {
                  console.log('sssssssssssssssssss'+result.substring(0,4)+"="+username+"="+password);
                  return callback(new Error('wrong'));
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

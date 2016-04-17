#Node.js版本 实现登录验证,查看课表和成绩，支持更新。
##准备工作（工具）
1.安装mongodb（非关系型数据库）  
添加mongodb签名到APT  
`$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10`  
创建mongodb-org-3.0.list文件  
`$ echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list`  
更新软件源列表  
`$ sudo apt-get update`  
安装mongodb（默认是安装最新版）  
`$ sudo apt-get install -y mongodb-org`  
启动mongodb：  
`$ sudo service mongod start`  
停止mongodb：  
`$ sudo service mongod stop`  
重启mongodb  
`$ sudo service mongod restart`  
2.安装tesseract-ocr（图像解析）  
`$ sudo apt-get install tesseract-ocr`  
3.安装git  
`$ apt-get install git`
##配置环境
1.安装nvm（Node Version Manager）  
`$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.2/install.sh | bash`  
2.安装node.js（开发环境 0.12.7）  
`$ nvm install 0.12.7`  
设置默认node版本  
`$ nvm alias default 0.12.7`  
3.导入项目csxylink  
`$ git clone https://github.com/wuxiwei/csxylink`  
4.安装依赖包  
`$ npm install`  
注：安装mongoose时会停留在  
`> node-gyp rebuild || exit 0`  
网上有两种说法：  
-全局模式重装node-gyp；  
-全局模式安装kerberos；  
也可以先不管，对项目没有影响，直接等待会自动跳过。  
5.后台运行  
`$ nohup node app.js &`
后期可以在目录下nohup.out中查看日志
##用法说明
####1.登录验证
`$ curl -d 'username=学号&password=密码' http://yourserver:port/api/login`
#####请求
#####响应
-`{"status":"ok","man":"姓名"}`成功  
-`{"status":"login failed"}`失败  
-`{"status":"School network connection failure"}`校网或网络问题
####2.课表查询
`$ curl -d 'username=学号&password=密码&action=动作' http://yourserver:port/api/schedule`  
#####请求
-`action=get`获取课表  
-`action=update`更新课表
#####响应
-`{"status":"ok","schedule":{课表}}`成功  
-`{"status":"School network connection failure"}`校网或网络问题（学号或密码错误）  
-`{"status":"internal error"}`内部错误（概率小）
####3.成绩查询
`$ curl -d 'username=学号&password=密码&termstring=时间段&action=动作' http://yourserver:port/api/grade`
#####请求
-`action=get`获取成绩  
-`action=update`更新成绩  
-`termstring=2014-2015学年第1学期`查询相应时间段成绩
#####响应
-`{"status":"ok","grade":{成绩}}`成功  
-`{"status":"School network connection failure"}`校网或网络问题（学号或密码错误）  
-`{"status":"internal error"}`内部错误（概率小）
##后台维护
1.每学期更新config配置文件  
2.每学期清空课表数据库（可选）
##开发原则
1.利用缓存和数据库，尽可能减少访问校网。  
2.只要获取到数据，不管出现任何异常问题，首先确保数据返回给用户。（注意return的使用）
##新的想法
关于后台每学期更新配置表不方便的解决方案
在每次根据学期字段的位置请求数据之前，我们先将网站上的所有字段通过空请求获取到存入数组,
两个好处：一：不用每学期更改相应字段，客户端也可以根据学期段来获取。二：校网如果不定时更新该数组，也可以很好的自动处理。
建议：也可以将数组存入缓存中，避免每次请求都要先获取。

var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter');
var config = require('./config');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(compression());

app.use('/api/', apiRouter);


app.listen(config.port, function() {
  console.log('listening ' + config.port);
});

module.exports = app;

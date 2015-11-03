var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('connect to %s error: ', config.db, err.message);
		process.exit(1);
	}
});

// models
require('./user');
require('./grade');
require('./schedule');
exports.User = mongoose.model('User');
exports.Grade = mongoose.model('Grade');
exports.Schedule = mongoose.model('Schedule');


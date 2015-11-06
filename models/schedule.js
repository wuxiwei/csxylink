var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ScheduleSchema = new Schema({
  username: { type: String, default : '匿名用户' },
  schedules: { type: String },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});


ScheduleSchema.index({user: 1}, {unique: true});

mongoose.model('Schedule', ScheduleSchema);

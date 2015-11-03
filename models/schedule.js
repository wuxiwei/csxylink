var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ScheduleSchema = new Schema({
  user: { type: ObjectId, ref: 'User' },
  schedules: [{ schedule: String, term: Number }],

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});


ScheduleSchema.index({user: 1}, {unique: true});

mongoose.model('Schedule', ScheduleSchema);

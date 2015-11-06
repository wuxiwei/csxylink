var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var GradeSchema = new Schema({
  username: { type: String, default : '匿名用户' },
  grades: { type: String },
  termstring: { type: String },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

mongoose.model('Grade', GradeSchema);

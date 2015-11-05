var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var GradeSchema = new Schema({
  username: { type: String, default : '匿名用户' },
  grades: [{ grade: String, term: Number }],

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});


GradeSchema.index({user: 1}, {unique: true});

mongoose.model('Grade', GradeSchema);

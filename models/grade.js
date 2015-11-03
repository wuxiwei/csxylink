var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var GradeSchema = new Schema({
  user: { type: ObjectId, ref: 'User' },
  grades: [{ grade: String, term: Number }],

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});


GradeSchema.index({user: 1}, {unique: true});

mongoose.model('Grade', GradeSchema);

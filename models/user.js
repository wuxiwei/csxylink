var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,    //姓名
  username: String,   //学号
  password: String,   //密码
  is_block: { type: Boolean, default: false },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});


UserSchema.index({username: 1}, {unique: true});
UserSchema.index({password: 1});

mongoose.model('User', UserSchema);

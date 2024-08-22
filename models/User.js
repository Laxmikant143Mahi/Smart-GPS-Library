// user.js
const Mongoose = require("mongoose");
// const mongoosePaginate = require('mongoose-paginate-v2')

const userSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  s_code: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = Mongoose.model("admins", userSchema);
module.exports = User;

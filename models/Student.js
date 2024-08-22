const Mongoose = require("mongoose");
// const mongoosePaginate = require('mongoose-paginate-v2')

const studentSchema = new Mongoose.Schema({
  enrollment_no: {
    type: String,
    unique: true,
    required: true,
  },
  roll_no: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "Student At Government Polytechnic Solapur",
  },
  email: {
    type: String,
  },
  mobile_no: {
    type: String,
  },
  adhar_no: {
    type: String,
  },
  gender: {
    type: String,
  },
  current_year: {
    type: String,
  },
  branch: {
    type: String,
  },
  book_limit: {
    type: String,
  },
  stud_img: {
    type: String,
    default:'profile.png'
  },
  status: {
    type: String,
  },
  bookIssueInfo: [String],
  notifications: [],
  remarks: {
    type: String,
  },
  fineFlag: {
    type: Boolean,
    default: false,
  },
  fines: {
    type: Number,
    default: 0,
  },
  joined: { type: Date, default: Date.now() },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
const Student = Mongoose.model("students", studentSchema);
module.exports = Student;

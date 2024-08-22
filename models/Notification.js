const Mongoose = require("mongoose");

const notificationSchema = new Mongoose.Schema({
  book_info: {
    id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    book_title: String,
    accession_no: String,
    related_to: String,
    book_img: String,
    issueDate: { type: Date, default: Date.now() },
    returnDate: { type: Date, default: Date.now() + 7 * 24 * 60 * 60 * 1000 },
  },
  student_info: {
    id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    username: String,
    enrollment_no: String,
    stud_img: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
});
const Notification = Mongoose.model("notification", notificationSchema);
module.exports = Notification;

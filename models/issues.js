const Mongoose = require("mongoose");

const issueSchema = new Mongoose.Schema({
  book_info: {
    id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    book_title: String,
    book_author: String,
    accession_no: String,
    book_schema: String,
    related_to: String,
    book_img: String,
    issueDate: { type: Date, default: Date.now() },
    returnDate: { type: Date, default: Date.now() + 7 * 24 * 60 * 60 * 1000 },
    isRenewed: { type: Boolean, default: false },
  },

  student_info: {
    id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    username: String,
    enrollment_no: String,
    branch: String,
    fines: { type: String, default: "" },
    stud_img: String,
  },
  isReturn: {
    type: Boolean,
    default: false,
  },
  overDue: {
    type: Boolean,
    default: false,
  },
});
const Issue = Mongoose.model("issues", issueSchema);
module.exports = Issue;

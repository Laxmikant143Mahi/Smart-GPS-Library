const Mongoose = require("mongoose");

const defaulterSchema = new Mongoose.Schema({
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
    issueDate: { type: Date },
    returnDate: { type: Date },
    isRenewed: { type: Boolean, default: false },
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
  fine:String,
  isReturn: {
    type: Boolean,
    default: false,
  },
});
const Defaulter = Mongoose.model("defaulter", defaulterSchema);
// module.exports = Defaulter;

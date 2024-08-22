const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const bookSchema = new Schema(
  {
    accession_no: [String],
    book_title: {
      type: String,
    },
    book_author: {
      type: String,
    },
    book_edition: {
      type: String,
    },
    place_and_publisher: {
      type: String,
    },
    book_published_year: {
      type: String,
    },
    total_pages: {
      type: String,
    },
    book_volume: {
      type: String,
    },
    book_schema: {
      type: String,
    },
    book_source: {
      type: String,
    },
    bill_no: {
      type: String,
    },
    bill_date: {
      type: String,
    },
    book_cost: {
      type: String,
    },
    classification_no: {
      type: String,
    },
    book_quantity: {
      type: String,
    },
    withdrawal_date: {
      type: String,
    },
    withdrawal_no: {
      type: String,
    },
    book_status: {
      type: String,
    },
    related_to: {
      type: String,
    },
    remarks: {
      type: String,
    },
    issued_no: [String],
    book_img: {
      type: String,
    },
    un_issued_no: [String],
    book_img: {
      type: String,
    },
  },
  { timestamps: true }
);
const menuSchema = new Schema({
  department: [String],
  book_scheme: [String],
  accession_nos: {
    type: Number,
  },
});
bookSchema.plugin(mongoosePaginate);
const Book = mongoose.model("books", bookSchema);
const dMenu = mongoose.model("menus", menuSchema);
module.exports = { Book, dMenu };

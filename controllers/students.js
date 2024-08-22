const { Book, dMenu } = require("../models/book");
const Notification = require("../models/Notification");
const Feedback = require("../models/Feedback");
const Student = require("../models/Student");
const Issue = require("../models/issues");

exports.getStudDashboard = async (req, res, next) => {
  try {
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    const books = await Book.find();
    const book_count = await Book.find().countDocuments();
    res.status(200).render("user", {
      department: dmenu.department,
      book_scheme: dmenu.book_scheme,
      book_count: book_count,
      books: books,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getHelp = async (req, res, next) => {
  try {
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    res.status(200).render("user/help", {
      department: dmenu.department,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getFeedBack = async (req, res, next) => {
  try {
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    res.status(200).render("user/feedback", {
      department: dmenu.department,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.postFeedBack = async (req, res, next) => {
  try {
    const { username, feedback } = req.body;
    let newFeedback = new Feedback({ username: username, feedback: feedback });
    newFeedback
      .save()
      .then((response) => {
        req.flash(
          "success",
          "" + response.username + " Your Feedback Sent Successfully"
        );
        res.redirect("/user/1/feedback/");
      })
      .catch((error) => {
        req.flash(
          "success",
          "" + response.username + " Failed to Send Feedback"
        );
        res.redirect("/user/1/feedback/");
      });
  } catch (error) {
    console.log(error);
  }
};
exports.postLandingFeedBack = async (req, res, next) => {
  try {
    const { username, feedback } = req.body;
    let newFeedback = new Feedback({ username: username, feedback: feedback });
    newFeedback
      .save()
      .then((response) => {
        req.flash(
          "success",
          "" + response.username + " Your Feedback Sent Successfully"
        );
        res.redirect("/");
      })
      .catch((error) => {
        req.flash(
          "success",
          "" + response.username + " Failed to Send Feedback"
        );
        res.redirect("/");
      });
  } catch (error) {
    console.log(error);
  }
};
// get student profile
exports.getProfile = async (req, res, next) => {
  try {
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    const books = await Book.find();
    const book_count = await Book.find().countDocuments();
    const issuedBook = await Issue.find();
    res.render("user/profile", {
      department: dmenu.department,
      book_count: book_count,
      books: books,
      issuedBook,
    });
  } catch (error) {
    console.log(error);
  }
};
// get student update profile
exports.getUpdateProfile = async (req, res, next) => {
  try {
    const student_id = await req.query.update;
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    const u_student = await Student.findById(student_id);
    // console.log("Book Info Sent");
    res.status(200).render("user/updateProfile", {
      department: dmenu.department,
      scheme: dmenu.book_scheme,
      u_student,
    });
  } catch (error) {
    console.log(error);
  }
};
// Student -> Add bio
exports.postAddBio = async (req, res, next) => {
  const { bio } = req.body;
  try {
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    const student = await Student.findById(req.body.stud_id);
    student.bio = bio;
    await student
      .save()
      .then((response) => {
        res.json({
          msg: "success",
        });
      })
      .catch((error) => {
        res.json({
          msg: "error",
        });
      });
  } catch (error) {
    console.log(error);
  }
};

// Student -> Get books using department
exports.getDeptBooks = async (req, res, next) => {
  try {
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    // const books = await Book.find()
    // const book_count = await Book.find().countDocuments();
    const books = await Book.find({ $or: [{ related_to: req.query.dept }] });
    const book_count = await Book.find({
      $or: [{ related_to: req.query.dept }],
    }).countDocuments();
    res.render("user/showBooks", {
      department: dmenu.department,
      book_count: book_count,
      book_schema: dmenu.book_scheme,
      books: books,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getSchemeBooks = async (req, res, next) => {
  try {
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    // const books = await Book.find()
    // const book_count = await Book.find().countDocuments();
    const books = await Book.find({ $or: [{ book_schema: req.query.scheme }] });
    const book_count = await Book.find({
      $or: [{ book_schema: req.query.scheme }],
    }).countDocuments();
    res.render("user/showBooks", {
      department: dmenu.department,
      book_schema: dmenu.book_scheme,
      book_count: book_count,
      books: books,
    });
  } catch (error) {
    console.log(error);
  }
};

// Student -> Issue Book
exports.postIssueBook = async (req, res, next) => {
  const { book_id, stud_id, acc_no } = req.body;

  const student = await Student.findById(stud_id);
  const book = await Book.findById(book_id);
  let bookInfoLength = student.bookIssueInfo.length;
  // get student , check student status,fineFlag,book_limit
  if (student.fineFlag) {
    res.json({
      type: "error",
      msg: "Sorry You Don't Have Permission to issue book, Complete Your Previous Books Fines",
    });
  } else if (student.book_limit != bookInfoLength) {
    try {
      // Store new Notification
      console.log(student.branch)
      const notification = new Notification({
        book_info: {
          id: book._id,
          book_title: book.book_title,
          accession_no: acc_no,
          related_to: book.related_to,
          book_img: book.book_img,
        },
        student_info: {
          id: student._id,
          username: student.username,
          enrollment_no: student.enrollment_no,
          branch: student.branch,
          stud_img: student.stud_img,
        },
      });
      // Add Book In Student bookInfo Array in database
      // student.bookIssueInfo.push(book_id);
      await Student.findOneAndUpdate(
        { _id: stud_id },
        {
          // to add/update9
          $addToSet: {
            bookIssueInfo: book_id,
          },
        }
      );
      // Remove accession no from un_issued_books and add this acc_no into issued books
      await Book.updateMany(
        { _id: book_id },
        { $pull: { un_issued_no: acc_no } }
      );
      // Add accession in issued books array
      await Book.findOneAndUpdate(
        { _id: book_id },
        {
          // to add/update
          $addToSet: {
            issued_no: acc_no,
          },
        }
      );
      await book.save();
      await student.save();
      await notification
        .save()
        .then((response) => {
          res.json({
            msg: "Book Issue Request Sent To Librarian!!!",
          });
        })
        .catch((error) => { 
          res.json({
            msg: error,
          });
        });
    } catch (err) {
      console.log(err);
      return res.redirect("back");
    }
  } else {
    res.json({
      type: "error",
      msg: "Sorry You can't Issue more than 2 books",
    });
  }
};

// Student -> Update Data
exports.postUpdateStudent = async (req, res, next) => {
  // update student data using student id
  try {
    const student_id = await req.body.student_id;
    console.log(student_id);
    // update student using student_id
    await Student.updateOne(
      { _id: student_id },
      {
        $set: {
          enrollment_no: req.body.enrollment_no,
          roll_no: req.body.roll_no,
          username: req.body.username,
          email: req.body.email,
          mobile_no: req.body.mobile_no,
          adhar_no: req.body.adhar_no,
          gender: req.body.gender,
          current_year: req.body.current_year,
          branch: req.body.branch,
          status: req.body.status,
        },
      },
      { $currentDate: { lastUpdated: true } }
    )
      .then((response) => {
        req.flash("success", "Student Updated Successfully ");
        res.redirect("/user/1/updateProfile?update=" + student_id);
      })
      .catch((error) => {
        res.json({
          message: "An error occurs",
        });
      });
  } catch (error) {
    console.log(error);
  }
};
// Student -> update Student Image
exports.postUpdateImage = async (req, res, next) => {
  try {
    const student = await Student.findById(req.body.student_id);
    // single image
    if (req.file) {
      // book.book_img = req.file.path
      let str = req.file.path;
      newstr = str.replace(/[&\/\\]/g, "/");
      // console.log("File Name : " + newstr);
      student.stud_img = newstr;
    }
    student
      .save()
      .then((student) => {
        req.flash(
          "success",
          "Hey " +
            student.username +
            " Your Profile Pic Updated Successfully!!!"
        );
        res.redirect("/user/1/updateProfile?update=" + req.body.student_id);
        //   res.json({
        //     message: 'Book Added Successful',
        //   })
      })
      .catch((error) => {
        req.flash("error", "Failed to update profile pic !!!");
        res.redirect("/user/1/updateProfile?update=" + req.body.student_id);
      });
  } catch (err) {
    req.flash("error", "Failed to update profile pic !!!");
    res.redirect("/user/1/updateProfile?update=" + req.body.student_id);
  }
};

exports.postSetRead = async (req, res, next) => {
  const { stud_id, book_id } = req.body;
  const student = await Student.findById(stud_id);
  // update student notification status in mongodb
  try {
    await Student.updateMany(
      // query
      { _id: stud_id, "notifications.book_id": book_id },
      {
        $set: {
          "notifications.$[].isRead": true,
        },
      }
    );
    res.json({
      msg: "success",
    });
  } catch (error) {
    res.json({
      msg: "error" + error,
    });
  }
};

exports.postStudentNotifications = async (req, res, next) => {
  const { stud_id } = req.body;
  const nt = await Student.findById(stud_id);
  res.json({
    notification: nt.notifications,
  });
};

const maxAge = 3 * 24 * 60 * 60;
exports.getLogout = async (req, res) => {
  res.cookie("user", "", { maxAge });
  res.redirect("/");
};

const { Book, dMenu } = require("../models/book");
const Student = require("../models/Student");
const Issue = require("../models/issues");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const maxAge = 3 * 24 * 60 * 60;

exports.getDashboard = async (req, res, next) => {
  try {
    const books = await Book.find();
    const issues = await Issue.find();
    const book_count = await Book.find().countDocuments();
    const issues_count = await Issue.find({ isReturn: false }).countDocuments();
    const return_count = await Issue.find({ isReturn: true }).countDocuments();
    const student_count = await Student.find().countDocuments();
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    await postAddInDefaulter();
    // await Student.deleteMany({ adhar_no: 'xxxx xxxx xxxx xxxx' });
    res.status(200).render("admin", {
      students: student_count,
      department: dmenu.department,
      scheme: dmenu.book_scheme,
      book: book_count,
      books: books,
      issues_count,
      return_count,
      issues,
      r_books: 1020,
    });
  } catch (error) {
    // send 404 page
    console.log(error);
  }
};

// ------------------------------ Books (Get) Operations  Started ------------------------------------------
// 1. addBook page
// 2. updateBook page
// 3. showBooks
// 4. issueBook
// 5. reissueBook
// 6. issueBook Details
// 7. reissueBook Details
// 8. Return Book
// ----------------------------- Books (Get) Operations  Started- ------------------------------------------
// 1. addBook page
exports.getAddbook = async (req, res, next) => {
  try {
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    res.status(200).render("admin/addBook", {
      department: dmenu.department,
      scheme: dmenu.book_scheme,
      accession_nos: dmenu.accession_nos,
    });
  } catch (error) {
    // send 404 page adding dept
    console.log(error);
  }
};
// 2. Get Update Book
exports.getUpdatebook = async (req, res, next) => {
  try {
    const book_id = req.query.book;
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    if (book_id == undefined) {
      console.log("Book Info Not Sent");
      res.status(200).render("admin/updateBook", {
        department: dmenu.department,
        scheme: dmenu.book_scheme,
        book: "",
      });
    } else {
      const book = await Book.findById(book_id);
      res.status(200).render("admin/updateBook", {
        department: dmenu.department,
        scheme: dmenu.book_scheme,
        book,
      });
    }
  } catch (error) {
    // send 404 page 'error in updating book
    console.log(error);
  }
};

// 3. Get showBooks
exports.getShowbooks = async (req, res, next) => {
  try {
    // fetching books
    const books = await Book.find();
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");

    const book_count = await Book.find().countDocuments();
    res.status(200).render("admin/showBooks", {
      books: books,
      department: dmenu.department,
      scheme: dmenu.book_scheme,
      book_count: book_count,
    });
  } catch (err) {
    return res.redirect("back");
  }
};
// 6. get issued Book Details
exports.getIssuedBook = async (req, res, next) => {
  try {
    // fetching books
    const books = await Book.find();
    const issues = await Issue.find();
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    const issues_count = await Issue.find().countDocuments();
    const book_count = await Book.find().countDocuments();
    res.status(200).render("admin/issuedBooks", {
      books: books,
      department: dmenu.department,
      scheme: dmenu.book_scheme,
      book_count: book_count,
      issues,
      issues_count,
    });
  } catch (err) {
    return res.redirect("back");
  }
};
// 6. get issued Book Details
exports.getDefaulterList = async (req, res, next) => {
  try {
    // fetching books
    const books = await Book.find();
    const issues = await Issue.find();
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    const issues_count = await Issue.find().countDocuments();
    const book_count = await Book.find().countDocuments();
    await postAddInDefaulter();
    res.status(200).render("admin/showDefaulter", {
      books: books,
      department: dmenu.department,
      scheme: dmenu.book_scheme,
      book_count: book_count,
      issues,
      issues_count,
    });
  } catch (err) {
    return res.redirect("back");
  }
};
// get All Books info
exports.postIssuedBook = async (req, res, next) => {
  try {
    // fetching books
    const issues = await Issue.find();
    res.json({
      books: issues,
    });
  } catch (err) {
    return res.redirect("back");
  }
};
// Get Return Book
exports.getReturnBook = async (req, res, next) => {
  try {
    if (req.query.en == null) {
      // console.log("undefined")
      res.status(200).render("admin/returnBook", {
        enrollment_no: "",
      });
    } else {
      res.status(200).render("admin/returnBook", {
        enrollment_no: req.query.en,
      });
    }
  } catch (err) {
    return res.redirect("back");
  }
};

// ------------------------------ Books ( POST ) Operations  Started -------------------------------------------
// 1. addBook
// 2. updateBook
// 3. showBooks
// 4. issueBook
// 5. reissueBook
// 6. issueBook
// 7. reissueBook
// 8. Add Scheme
// 9. Add Department
// 10 Return a Book
// ------------------------------ Books ( POST ) Operations  Started -------------------------------------------

// 1. addBook
exports.postAddBook = async (req, res, next) => {
  try {
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    let book = new Book({
      book_title: req.body.book_title,
      book_author: req.body.book_author,
      book_edition: req.body.book_edition,
      place_and_publisher: req.body.place_and_publisher,
      book_published_year: req.body.book_published_year,
      total_pages: req.body.total_pages,
      book_volume: req.body.book_volume,
      book_schema: req.body.book_schema,
      book_source: req.body.book_source,
      bill_no: req.body.bill_no,
      bill_date: req.body.bill_date,
      book_cost: req.body.book_cost,
      classification_no: req.body.classification_no,
      book_quantity: req.body.book_quantity,
      withdrawal_date: req.body.withdrawal_date,
      withdrawal_no: req.body.withdrawal_no,
      book_status: req.body.book_status,
      related_to: req.body.related_to,
      remarks: req.body.remarks,
    });
    let newAccArray = [];
    let current_ac = dmenu.accession_nos;
    let last_ac = req.body.book_quantity;
    const finalLen = parseInt(current_ac) + parseInt(last_ac);
    await dMenu.findOneAndUpdate(
      { _id: "6426f6046966cdf67d419e72" },
      {
        $set: {
          accession_nos: finalLen,
        },
      }
    );
    //  ca =10   ;   10 <= 10+5 =15 ; ca+1
    for (current_ac; current_ac < finalLen; current_ac++) {
      newAccArray.push(current_ac);
    }
    book.accession_no = newAccArray;
    book.un_issued_no = newAccArray;
    // single image
    if (req.file) {
      // book.book_img = req.file.path
      let str = req.file.path;
      newstr = str.replace(/[&\/\\]/g, "/");
      // console.log("File Name : " + newstr);
      book.book_img = newstr;
    }
    await book
      .save()
      .then((book) => {
        console.log(book);
        req.flash("success", "New Book Added Successfully " + book.book_title);
        res.redirect("/admin/books/add");
      })
      .catch((error) => {
        res.json({
          message: "An error occurs",
        });
      });
  } catch (err) {
    return res.redirect("back");
  }
};
// 2. Update Book Using Book Id
exports.postUpdateBook = async (req, res, next) => {
  const book_id = req.body.book_id;
  await Book.updateOne(
    { _id: book_id },
    {
      $set: {
        book_title: req.body.book_title,
        book_author: req.body.book_author,
        book_edition: req.body.book_edition,
        place_and_publisher: req.body.place_and_publisher,
        book_published_year: req.body.book_published_year,
        total_pages: req.body.total_pages,
        book_volume: req.body.book_volume,
        book_schema: req.body.book_schema,
        book_source: req.body.book_source,
        bill_no: req.body.bill_no,
        bill_date: req.body.bill_date,
        book_cost: req.body.book_cost,
        book_quantity: req.body.book_quantity,
        withdrawal_date: req.body.withdrawal_date,
        withdrawal_no: req.body.withdrawal_no,
        book_status: req.body.book_status,
        related_to: req.body.related_to,
        remarks: req.body.remarks,
      },
    },
    { $currentDate: { lastUpdated: true } }
  )
    .then((book) => {
      req.flash("success", "Book Updated Successfully " + req.body.book_title);
      res.redirect("/admin/books/update/?book=" + book_id);
    })
    .catch((error) => {
      res.json({
        message: "An error occurs",
      });
    });
};
// 4. Issue new book
exports.postIssueAccept = async (req, res, next) => {
  // get Issue student info , book info and save that data in issue book collection and then send notification to that student.
  try {
    const { stud_id, book_id, acc_no, not_id } = req.body;
    const student = await Student.findById(stud_id);
    const book = await Book.findById(book_id);
    const notification = await Notification.findById(not_id);
    // console.log(student.username);

    // 1. add add new data in issue book
    const newIssue = new Issue({
      book_info: {
        id: book._id,
        book_title: book.book_title,
        book_author: book.book_author,
        accession_no: acc_no,
        related_to: book.related_to,
        book_schema: book.book_schema,
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
    // 2.send notification to the student
    await Student.updateOne(
      { _id: stud_id },
      {
        $push: {
          notifications: {
            $each: [
              {
                book_id: "" + book._id,
                book_title: book.book_title,
                accession_no: acc_no,
                book_img: book.book_img,
                status: "success",
                msg: "Book Issued Success Fully",
                isRead: false,
              },
            ],
          },
        },
      }
    );
    // 3. update current notification state
    await Notification.updateOne({ _id: not_id }, { $set: { status: true } });
    await notification.save();
    await student.save();
    await newIssue.save();
    res.json({
      message:
        "Request Accepted " + student.username + " Book Acc No : " + acc_no,
    });
  } catch (err) {
    console.log("Unknown Error Occurs");
  }
};
// post Issue Rejected send notification to student
exports.issueBookRejected = async (req, res, next) => {
  try {
    const { stud_id, book_id, book_acc, not_id, msg } = req.body;
    const student = await Student.findById(stud_id);
    const book = await Book.findById(book_id);

    // 1.send notification to the student
    try {
      await Student.updateOne(
        { _id: stud_id },
        {
          $push: {
            notifications: {
              $each: [
                {
                  book_id: "" + book._id,
                  book_title: book.book_title,
                  accession_no: book_acc,
                  book_img: book.book_img,
                  status: "error",
                  msg: "Book Issue Rejected By Admin for " + msg,
                  isRead: false,
                },
              ],
            },
          },
          $pull: { bookIssueInfo: book_id },
        }
      );
      //  2. Update Book Acc No's Remove accession no from issued_books and add this acc_no into un_issued books
      await Book.updateOne(
        { _id: book_id },
        { $pull: { issued_no: book_acc } }
      );
      // Add accession in issued books array
      await Book.findOneAndUpdate(
        { _id: book_id },
        {
          // to add/update
          $addToSet: {
            un_issued_no: book_acc,
          },
        }
      );
      // 3. update current notification state
      await Notification.updateOne({ _id: not_id }, { $set: { status: true } });
      res.json({
        message: "Notification Sent To " + student.username,
      });
    } catch (err) {
      res.json({
        message: "Notification Failed To Send" + student.username,
      });
    }
  } catch (err) {
    res.json({
      error: "An Error Occurs",
    });
  }
};

// Send Issued Book Data Using Student Enrollment no
exports.postIssuedBooks = async (req, res, next) => {
  const { en_no } = req.body;
  const books = await Issue.find({
    "student_info.enrollment_no": "" + en_no,
  });
  if (books.length > 0) {
    res.json({
      msg: books.length + " Book Issues !!!",
      books,
    });
  } else {
    res.json({
      msg: "0 Book Issues !!!",
      books,
    });
  }
};

// Admin -> Return Book using issue id

exports.postReturnBook = async (req, res, next) => {
  const issue = await Issue.findById(req.body.issue_id);
  try {
    // Step 1 -> set isReturn True In Issue
    await Issue.updateOne(
      { _id: req.body.issue_id },
      { $set: { isReturn: true, overDue: false, "student_info.fines": "" } }
    );
    // Step 2 -> replace accession no in issued_no array to un_issued_no
    await Book.updateOne(
      { _id: issue.book_info.id },
      { $pull: { issued_no: issue.book_info.accession_no } }
    );
    await Book.updateOne(
      { _id: issue.book_info.id },
      {
        // to add/update
        $addToSet: {
          un_issued_no: issue.book_info.accession_no,
        },
      }
    );

    // Step 3 -> remove book id from student bookIssueInfo Array
    await Student.updateOne(
      { _id: issue.student_info.id },
      {
        $pull: { bookIssueInfo: issue.book_info.id },
        $set: { fineFlag: false, fines: "" },
      }
    );

    // Step 4 -> add new notification in students notifications array
    await Student.updateOne(
      { _id: issue.student_info.id },
      {
        $push: {
          notifications: {
            $each: [
              {
                book_id: "" + issue.book_info.id,
                book_title: issue.book_info.book_title,
                accession_no: issue.book_info.accession_no,
                book_img: issue.book_info.book_img,
                status: "return",
                msg: "Book Returned Successfully",
                isRead: false,
              },
            ],
          },
        },
      }
    );

    // send response message
    res.json({
      message: "Book Returned Successfully",
    });
  } catch (err) {
    // send response message
    res.json({
      message: "Error : " + err,
    });
  }
};
// Admin -> Add book in defaulter database "Pending......"
const postAddInDefaulter = async (req, res, next) => {
  // get Issue books
  const IssuedBooks = await Issue.find();
  // get current date
  let today = new Date();

  IssuedBooks.forEach(async (issue) => {
    // check issue.isReturn false & return date is less than current date if this two conditions true then set overdue=true and add fine to that particular student
    if (issue.isReturn === false && issue.book_info.returnDate < today) {
      // find the student using student id from Student database
      const student = await Student.findById(issue.student_info.id);
      // console.log(student);
      const daysOverdue = Math.ceil(
        (today - issue.book_info.returnDate) / (1000 * 60 * 60 * 24) - 1
      );
      const fineAmount = daysOverdue * 5;
      // console.log(fineAmount, daysOverdue);
      // update student fineFlag = true and fine = fineAmount in mongodb
      await Student.updateOne(
        { _id: issue.student_info.id },
        { $set: { fineFlag: true, fines: fineAmount } }
      );
      await Issue.updateOne(
        { _id: issue._id },
        { $set: { overDue: true, "student_info.fines": fineAmount } }
      );
    } else {
      console.log("0 Overdue Books");
    }
  });
};

// ------------------------------ Table Filtering Started -----------------------------------------
// Add New Book Scheme
exports.addbookScheme = async (req, res, next) => {
  try {
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    let arr = dmenu.book_scheme;
    // console.log(arr.includes(req.body.newScheme));
    if (arr.includes(req.body.newScheme)) {
      const data = dMenu
        .findOneAndUpdate(
          { _id: "6426f6046966cdf67d419e72" },
          {
            // to add/update
            $addToSet: {
              book_scheme: req.body.newScheme,
            },
          }
        )
        .then((data) => {
          req.flash(
            "success",
            "New Book Scheme Added Successfully " + req.body.newScheme
          );
          res.redirect("/admin");
        })
        .catch((error) => {
          req.flash("error", "An Error Occurs " + req.body.newScheme);
          res.redirect("/admin");
        });
    } else {
      req.flash("error", "Book Scheme Already Exists " + req.body.newScheme);
      res.redirect("/admin");
    }
  } catch (error) {
    return res.redirect("back");
  }
};
exports.addDepartment = async (req, res, next) => {
  try {
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    let arr = dmenu.department;
    // console.log(arr);
    if (arr.includes(req.body.newScheme)) {
      const data = dMenu
        .findOneAndUpdate(
          { _id: "6426f6046966cdf67d419e72" },
          {
            // to add/update
            $addToSet: {
              department: req.body.newScheme,
            },
          }
        )
        .then((data) => {
          req.flash(
            "success",
            "New Book Department Added Successfully " + req.body.newScheme
          );
          res.redirect("/admin");
        })
        .catch((error) => {
          req.flash("error", "An Error Occurs " + req.body.newScheme);
          res.redirect("/admin");
        });
    } else {
      req.flash("error", "Department Already Exists " + req.body.newScheme);
      res.redirect("/admin");
    }
  } catch (error) {
    return res.redirect("back");
  }
};
exports.getSuggestions = async (req, res, next) => {
  let searchData = req.body.serachData;
  // console.log(searchData);
  const regex = new RegExp(searchData, "i");
  const books = await Book.find(
    { book_title: regex },
    { book_title: 1, _id: 1, book_cost: 1 }
  )
    .limit(10)
    .then((response) => {
      res.json({
        books: response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An Error Occured!",
      });
    });
};
exports.postShowBooks = async (req, res, next) => {
  let searchData = req.body.serachData;
  console.log(searchData);
  await Book.find({
    $or: [
      {
        book_title: "" + searchData,
        // accession_no: searchData,
      },
    ],
  })
    .then((response) => {
      // console.log(response);
      res.json({
        books: response,
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({
        message: "An Error Occured!",
      });
    });
};
// Search Book Using Status
exports.postShowByStatus = (req, res, next) => {
  let status = req.body.statusData;
  // console.log(status);
  let newStatus;
  if (status === "Active") {
    newStatus = "Active";
  } else if (status === "In-Active") {
    newStatus = "In-Active";
  }
  Book.find({
    $or: [
      {
        book_status: newStatus,
      },
    ],
  })
    .then((response) => {
      // console.log(response);
      res.json({
        books: response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An Error Occured!",
      });
    });
};
// Search Book Using Book-Schema
exports.postShowByScheme = (req, res, next) => {
  let schema = req.body.schema;
  Book.find({
    $or: [
      {
        book_schema: schema,
      },
    ],
  })
    .then((response) => {
      // console.log(response);
      res.json({
        books: response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An Error Occurred!",
      });
    });
};
// Search Book Using Department
exports.postShowByDepartment = (req, res, next) => {
  let department = req.body.department;
  Book.find({
    $or: [
      {
        related_to: department,
      },
    ],
  })
    .then((response) => {
      // console.log(response);
      res.json({
        books: response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An Error Occurred!",
      });
    });
};
// Search Book Using Department
exports.postStudByDepartment = (req, res, next) => {
  let department = req.body.department;
  Student.find({
    $or: [
      {
        branch: department,
      },
    ],
  })
    .then((response) => {
      // console.log(response);
      res.json({
        students: response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An Error Occurred!",
      });
    });
};
// Search Student Using Status
exports.postStudentByStatus = (req, res, next) => {
  let status = req.body.statusData;
  // console.log(status);
  let newStatus;
  if (status === "Active") {
    newStatus = "Active";
  } else if (status === "In-Active") {
    newStatus = "In-Active";
  }
  Student.find({
    $or: [
      {
        status: newStatus,
      },
    ],
  })
    .then((response) => {
      // console.log(response);
      res.json({
        students: response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An Error Occurred!",
      });
    });
};
// Search Student Using Status
exports.postStudentByEnrollment = (req, res, next) => {
  let enrollment = req.body.statusData;

  Student.find({
    $or: [
      {
        enrollment_no: enrollment,
      },
    ],
  })
    .then((response) => {
      // console.log(response);
      res.json({
        students: response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An Error Occurred!",
      });
    });
};
// getIssueData using issue id
exports.getIssueData = async (req, res, next) => {
  let issue_id = req.body.issue_id;
  const issue = await Issue.findById(issue_id);
  const book = await Book.findById(issue.book_info.id);
  const student = await Student.findById(issue.student_info.id);
  res.status(200).json({
    issue,
    book,
    student,
  });
};
// Single Book Data
exports.getBookData = async (req, res, next) => {
  const book = await Book.findById(req.body.book_id);
  res.status(200).json({ book });
};

// ------------------------------ Students (Get) Operations  Started -----------------------------------------
// 1. addStudent page
// 2. updateStudent page
// 3. removeStudent
// 4. listAllStudents
// 5. reissueBook
// 6. issueBook Details
// 7. reissueBook Details
// ----------------------------- Students (Get) Operations  Started --------------------------------------------

exports.getAddStudent = async (req, res, next) => {
  try {
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    res.status(200).render("admin/addStudent", {
      department: dmenu.department,
      scheme: dmenu.book_scheme,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getUpdateStudent = async (req, res, next) => {
  try {
    const student_id = await req.query.student;
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    if (student_id == undefined) {
      // console.log("Book Info Not Sent");
      res.status(200).render("admin/updateStudent", {
        department: dmenu.department,
        scheme: dmenu.book_scheme,
        student: "",
      });
    } else {
      const student = await Student.findById(student_id);
      // console.log("Book Info Sent");
      res.status(200).render("admin/updateStudent", {
        department: dmenu.department,
        scheme: dmenu.book_scheme,
        student,
      });
    }
  } catch (error) {
    // send 404 page 'error in updating book
    console.log(error);
  }
};
exports.getAllStudents = async (req, res, next) => {
  try {
    // fetching books
    const students = await Student.find();
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    const student_count = await Student.find().countDocuments();
    res.status(200).render("admin/showStudents", {
      students: students,
      department: dmenu.department,
      scheme: dmenu.book_scheme,
      student_count: student_count,
    });
    // res.render('admin/showStudents')
  } catch (error) {
    console.log(error);
  }
};
// ------------------------------ Students (POST) Operations  Started -----------------------------------------
// 1. addStudent
// 2. updateStudent page
// 3. removeStudent
// 4. listAllStudents
// 5. reissueBook
// 6. issueBook Details
// 7. reissueBook Details
// 8. Get Single Student Using Id,username , enrollment no
// ----------------------------- Students (Get) Operations  Started --------------------------------------------

// 1. addStudent
exports.postAddStudent = async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hasedPass) {
    if (err) {
      res.json({
        error: err,
      });
    } else {
      let student = new Student({
        enrollment_no: req.body.enrollment_no,
        roll_no: req.body.roll_no,
        username: req.body.username,
        password: hasedPass,
        email: req.body.email,
        mobile_no: req.body.mobile_no,
        adhar_no: req.body.adhar_no,
        gender: req.body.gender,
        current_year: req.body.current_year,
        branch: req.body.branch,
        book_limit: req.body.book_limit,
        status: req.body.status,
        remarks: req.body.remarks,
      });
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
            "New Student Added Successfully " + student.username
          );
          res.redirect("/admin/students/add");
          //   res.json({
          //     message: 'Book Added Successful',
          //   })
        })
        .catch((error) => {
          res.json({
            message: "An error occurs" + error,
          });
        });
    }
  });
};

// for(let i = 2000150004;i<= 2000150006; i++){
//   const my_pass ="e_smarts";
//     bcrypt.hash(my_pass, 10, async function (err, hasedPass) {
//     if (err) {
//       console.log(err)
//     } else {
//       let student = new Student({
//         enrollment_no: i,
//         roll_no: "your no",
//         username: "Student ",
//         password: hasedPass,
//         email: "example@gmail.com",
//         mobile_no: "988131xxxx",
//         adhar_no:"xxxx xxxx xxxx xxxx",
//         gender: "Other",
//         current_year: "Third year",
//         branch: "Computer",
//         book_limit: "2",
//         status: "Active",
//         stud_img:"profile.png",
//         remarks: "Student At Government Polytechnic Solapur",
//       });
//      await student.save()
//         .then((student) => {
//           console.log("student added en no : "+i)
//         })
//         .catch((error) => {
//           console.log(error)
//         });
//     }
//   });
// }

// Admin -> Update Student
exports.postUpdateStudent = async (req, res, next) => {
  try {
    const student_id = await req.body.student_id;
    // console.log(student_id);
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
          book_limit: req.body.book_limit,
          status: req.body.status,
          remarks: req.body.remarks,
        },
      },
      { $currentDate: { lastUpdated: true } }
    )
      .then((response) => {
        req.flash(
          "success",
          "Student Updated Successfully " + req.body.username
        );
        res.redirect("/admin/students/update/?student=" + student_id);
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

// Get All True Notifications from Notification Database  this will fetch every second
exports.postNotifications = (req, res, next) => {
  Notification.find({
    $or: [
      {
        status: false,
      },
    ],
  })
    .then((response) => {
      res.json({
        notification: response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An Error Occured!",
      });
    });
};

// 8. Get single student data using stud_id, username, enrollment_no
exports.postStudentData = async (req, res, next) => {
  // find student using id
  const { _id } = req.body;
  // find student using stud_id , username, enrollment_no
  await Student.findOne({
    $or: [
      {
        _id,
      },
    ],
  })
    // await Student.findById(stud_id)
    .then((response) => {
      res.json({
        student: response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An Error Occured!" + error,
      });
    });
};

// Overdue Books Transfer
const defaulterList = async (req, res, next) => {
  // get return date if return date is less than current date then move add to overdue list
  const today = new Date();
  Issue.updateMany(
    { "book_info.returnDate": { $lt: today } }, // Filter documents where the return date is less than today
    { $set: { overDue: true } } // Set the 'overDue' field to true
  )
    .then((result) => {
      console.log(
        `Updated ${result.modifiedCount} documents. Overdue books marked as 'overDue: true'.`
      );
    })
    .catch((err) => {
      console.error("Error updating documents:", err);
      client.close();
    });
};
// defaulterList();
exports.getLogout = async (req, res) => {
  res.cookie("jwt", "", { maxAge });
  res.redirect("/");
};

const my_pass = "e_smart";
const addStudent = async () => {
  bcrypt.hash(my_pass, 10, async function (err, hasedPass) {
    if (err) {
      console.log(err);
    } else {
      let student = new Student({
        enrollment_no: enrolls[i],
        roll_no: roll_nos[i],
        username: "" + s_names[i],
        password: hasedPass,
        email: "example@gmail.com",
        mobile_no: "988131xxxx",
        adhar_no: "xxxx xxxx xxxx xxxx",
        gender: "Other",
        current_year: "Third year",
        branch: "Computer",
        book_limit: "2",
        status: "Active",
        stud_img: "profile.png",
        remarks: "Student At Government Polytechnic Solapur",
      });
      await student
        .save()
        .then((student) => {
          console.log("student added en no : " + roll_nos[i]);
          if (i >= rlength) {
            console.log("ends");
          } else {
            i++;
            addStudent();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
};

// addStudent();

// =============================================== HOD RESPONSES =====================================
exports.getHodDashboard = async (req, res, next) => {
  try {
    const books = await Book.find();
    const issues = await Issue.find();
    const book_count = await Book.find().countDocuments();
    const issues_count = await Issue.find({ isReturn: false }).countDocuments();
    const return_count = await Issue.find({ isReturn: true }).countDocuments();
    const student_count = await Student.find();
    const dmenu = await dMenu.findById("6426f6046966cdf67d419e72");
    // await Student.deleteMany({ adhar_no: 'xxxx xxxx xxxx xxxx' });
    res.status(200).render("hod", {
      students: student_count,
      department: dmenu.department,
      scheme: dmenu.book_scheme,
      book: book_count,
      books: books,
      issues_count,
      return_count,
      issues,
      r_books: 1020,
    });
  } catch (error) {
    // send 404 page
    console.log(error);
  }
};
exports.getHodLogout = async (req, res) => {
  res.cookie("hod", "", { maxAge });
  res.redirect("/");
};

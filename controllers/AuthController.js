const { Book, dMenu } = require("../models/book");
const User = require("../models/User");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getLandingPage = async (_req, res) => {
  // return res.render('landing.html')
  try {
    // fetching books
    const books = await Book.find();
    res.status(200).render("landing", {
      books: books,
    });
  } catch (err) {
    // console.log(err.messge);
    return res.redirect("back");
  }
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.ADMIN_SECRET, { expiresIn: maxAge });
};

exports.getAdminLoginPage = (req, res, next) => {
  res.render("admin/adminLogin");
};
exports.getAdminSignupPage = (req, res, next) => {
  res.render("admin/adminSignup");
};

exports.postAdminLogin = (req, res, next) => {
  let { username, password } = req.body;

  User.findOne({ $or: [{ username: username }] }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          // req.flash('error', err)
          res.redirect("/auth/admin-login");
        }
        if (result) {
          const token = createToken(user._id);
          res.cookie("jwt", token, { httpOnly: true }, maxAge * 1000);
          // console.log(user._id)
          req.flash(
            "success",
            "Hello, " + user.username + " Wel-Come To E-SMART G.P.S. Library!!!"
          );
          res.redirect("/admin");
        } else {
          req.flash("error", "Password Doesn't Match");
          res.redirect("/auth/admin-login");
        }
      });
    } else {
      req.flash("error", "User Not Found!");
      res.redirect("/auth/admin-login");
    }
  });
};
//  Admin Sign Up
exports.postAdminSignup = async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hasedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }
    let user = new User({
      username: req.body.username,
      password: hasedPass,
      s_code: req.body.s_code,
      isAdmin: true,
    });
    user
      .save()
      .then((user) => {
        req.flash(
          "success",
          "Hello, " + user.username + " Welcome to G.P.S. Library"
        );
        res.redirect("/admin");
      })
      .catch((error) => {
        res.json({
          message: "An error occurs",
        });
      });
  });
};
//  -------------------------------------=====================-----------------------------------------------
//  ------------------------------ User Authentication --------------------------------------
//  -------------------------------------=====================-----------------------------------------------
exports.getUserLoginPage = (req, res, next) => {
  res.render("user/userLogin");
};

exports.postUserLoginPage = (req, res, next) => {
  let { username, password } = req.body;
  // console.log(" Username : "+username+" Password : "+password)
  Student.findOne({ $or: [{ enrollment_no: username }] }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          // req.flash('error', err)
          res.redirect("/auth/user-login");
        }
        if (result) {
          const token = createToken(user._id);
          res.cookie("user", token, { httpOnly: true }, maxAge * 1000);
          // console.log(user.username)
          req.flash(
            "success",
            "Hello, " + user.username + " Welcome to Student Dashboard"
          );
          res.redirect("/user/1");
        } else {
          req.flash("error", "Password Doesn't Match");
          res.redirect("/auth/user-login");
        }
      });
    } else {
      req.flash("error", "Student Not Found!");
      res.redirect("/auth/user-login");
    }
  });
};

exports.getUserSignUp = (req, res, next) => {
  res.render("user/userLogin");
};

exports.postUserSignUp = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hasedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }
    let user = new Student({
      username: req.body.username,
      password: hasedPass,
      isAdmin: true,
    });
    user
      .save()
      .then((user) => {
        req.flash(
          "success",
          "Hello, " + user.username + " Welcome to Admin Dashboard"
        );
        res.redirect("/user/1");
      })
      .catch((error) => {
        res.json({
          message: "An error occurs",
        });
      });
  });
};

//=================================================== HOD Login Handler ============================================
exports.getHodLoginPage = async (req, res, next) => {
  const department = await dMenu.findById("6426f6046966cdf67d419e72");
  res.status(200).render("hod/hodLogin", {
    department: department.department,
  });
};
exports.getHodSignUpPage = async (req, res, next) => {
  const department = await dMenu.findById("6426f6046966cdf67d419e72");
  res.status(200).render("hod/hodSignup", {
    department: department.department,
  });
};

// =================================================== HOD Login =================================================
exports.postHodLogin = (req, res, next) => {
  let { branch, password } = req.body;

  User.findOne({ $or: [{ username: branch }] }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          // req.flash('error', err)
          res.redirect("/auth/hod-login");
        }
        if (result) {
          const token = createToken(user._id);
          res.cookie("hod", token, { httpOnly: true }, maxAge * 1000);
          // console.log(user._id)
          req.flash(
            "success",
            "Wel-Come To E-SMART G.P.S. Library!!!"
          );
          res.redirect("/gps/hod");
        } else {
          req.flash("error", "Password Doesn't Match");
          res.redirect("/auth/hod-login");
        }
      });
    } else {
      req.flash("error", "User Not Found!");
      res.redirect("/auth/hod-login");
    }
  });
};
// ===============================================================================================================
//  Admin Sign Up
exports.postHodSignup = async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hasedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }
    let user = new User({
      username: req.body.branch,
      password: hasedPass,
    });
    user
      .save()
      .then((user) => {
        req.flash("success", "HOD Sign-Up Successful");
        res.redirect("/gps/hod");
      })
      .catch((error) => {
        req.flash("error", "Already Have An Account");
        res.redirect("/auth/hod-signup");
      });
  });
};

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exits & is verifed
  if (token) {
    jwt.verify(token, process.env.ADMIN_SECRET, (err, decodedToken) => {
      if (err) {
        flash("error", "An Error Occured !!!");
        res.redirect("/auth/admin-login");
      } else {
        // console.log(decodedToken + Date())
        next();
      }
    });
  } else {
    res.redirect("/auth/admin-login");
  }
};

const loginAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exits & is verifed
  if (token) {
    jwt.verify(token, process.env.ADMIN_SECRET, (err, decodedToken) => {
      if (err) {
        flash("error", "An Error Occured !!!");
        res.redirect("/auth/admin-login");
      } else {
        console.log(decodedToken + Date());
        res.redirect("/admin");
      }
    });
  } else {
    next();
  }
};
const studentLoginAuth = (req, res, next) => {
  const token = req.cookies.user;
  // check json web token exits & is verifed
  if (token) {
    jwt.verify(token, process.env.ADMIN_SECRET, (err, decodedToken) => {
      if (err) {
        flash("error", "An Error Occured !!!");
        res.redirect("/auth/user-login");
      } else {
        console.log(decodedToken + Date());
        res.redirect("/user/1");
      }
    });
  } else {
    next();
  }
};

const studentAuth = (req, res, next) => {
  const token = req.cookies.user;
  // check json web token exits & is verifed
  if (token) {
    jwt.verify(token, process.env.ADMIN_SECRET, (err, decodedToken) => {
      if (err) {
        flash("error", "An Error Occured !!!");
        res.redirect("/auth/user-login");
      } else {
        // console.log(decodedToken)
        next();
      }
    });
  } else {
    res.redirect("/auth/user-login");
  }
};

const getCurrentUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.ADMIN_SECRET, async (err, decode) => {
      if (err) {
        console.log(err.message);
        res.locals.myuser = null;
        next();
      } else {
        // console.log(decode)
        let user = await User.findById(decode.id);
        res.locals.myadmin = user;
        next();
      }
    });
  } else {
    res.locals.myuser = null;
    next();
  }
};
const getStudent = (req, res, next) => {
  const token = req.cookies.user;
  if (token) {
    jwt.verify(token, process.env.ADMIN_SECRET, async (err, decode) => {
      if (err) {
        console.log(err.message);
        res.locals.mystudent = null;
        next();
      } else {
        // console.log(decode)
        let user = await Student.findById(decode.id);
        res.locals.mystudent = user;
        next();
      }
    });
  } else {
    res.locals.mystudent = null;
    next();
  }
};

// HOD
const requireHodAuth = (req, res, next) => {
  const token = req.cookies.hod;
  // check json web token exits & is verifed
  if (token) {
    jwt.verify(token, process.env.ADMIN_SECRET, (err, decodedToken) => {
      if (err) {
        flash("error", "An Error Occured !!!");
        res.redirect("/auth/hod-login");
      } else {
        // console.log(decodedToken + Date())
        next();
      }
    });
  } else {
    res.redirect("/auth/hod-login");
  }
};
const getCurrentHod = (req, res, next) => {
  const token = req.cookies.hod;
  if (token) {
    jwt.verify(token, process.env.ADMIN_SECRET, async (err, decode) => {
      if (err) {
        console.log(err.message);
        res.locals.currentHod = null;
        next();
      } else {
        // console.log(decode)
        let user = await User.findById(decode.id);
        res.locals.currentHod = user;
        next();
      }
    });
  } else {
    res.locals.currentHod = null;
    next();
  }
};

module.exports = {
  requireAuth,
  loginAuth,
  getCurrentUser,
  studentAuth,
  getStudent,
  getCurrentHod,
  studentLoginAuth,
  requireHodAuth,
};

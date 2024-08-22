const express = require("express");
// const methodOverride  = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const path = require("path");
const morgan = require("morgan");
const bodyboarder = require("body-parser");
const mongoose = require("mongoose");
const sanitizer = require("express-sanitizer");
const multer = require("multer");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");

// Routes Configuration
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const studentRoutes = require("./routes/student");
const dotenv = require("dotenv");

dotenv.config();

// app config
app.engine(".html", ejs.renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

// app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/images"));
app.use(express.static(__dirname));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sanitizer());

// Database Connection
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// const db = mongoose.connection
// db.on('error', (err) => {
//   console.log(err)
// })
// db.once('open', () => {
//   console.log('Database Connected Successfully!')
// })
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });
app.use(morgan("dev"));
app.use(bodyboarder.urlencoded({ extended: true }));
app.use(bodyboarder.json());

app.use(
  session({
    //must be declared before passport session and initialize method
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(flash());
// Middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.warning = req.flash("warning");
  next();
});

app.use(authRoutes);
app.use(adminRoutes);
app.use(studentRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});

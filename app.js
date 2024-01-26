const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const usersRouter = require("./routes/users");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

if (!!process.env.NODE_ENV && process.env.NODE_ENV !== "test") {
  //contect to database
}

app.use("/users", usersRouter);

module.exports = app;

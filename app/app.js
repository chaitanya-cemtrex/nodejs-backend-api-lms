const express = require("express");
const morgan = require("morgan");
const {
  globalErrorHandler,
  notFoundError,
} = require("../middlewares/globalErrorHandler");
const academicTermRouter = require("../routes/academics/academicTerm");
const academicYearRouter = require("../routes/academics/academicYear");
const classLevelRouter = require("../routes/academics/classLevel");
const programRouter = require("../routes/academics/program");
const subjectRouter = require("../routes/academics/subject");
const adminRouter = require("../routes/staff/adminRouter");

const app = express();

//middlewares
app.use(morgan("dev"));
app.use(express.json()); ///pass incoming json data

//Routes
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/academic-years", academicYearRouter);
app.use("/api/v1/academic-terms", academicTermRouter);
app.use("/api/v1/class-levels", classLevelRouter);
app.use("/api/v1/programs", programRouter);
app.use("/api/v1/subjects", subjectRouter);

//error handler middlewares
app.use(notFoundError);
app.use(globalErrorHandler);

module.exports = app;

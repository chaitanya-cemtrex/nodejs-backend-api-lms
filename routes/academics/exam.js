const express = require("express");
const {
  createExam,
  getExams,
  getExam,
  updateExam,
} = require("../../controllers/academics/examController");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLoggedIn = require("../../middlewares/isTeacherLoggedIn");

const examRouter = express.Router();

examRouter
  .route("/", isTeacherLoggedIn, isTeacher)
  .post(createExam)
  .get(getExams);

examRouter
  .route("/:id")
  .get(isTeacherLoggedIn, isTeacher, getExam)
  .put(isTeacherLoggedIn, isTeacher, updateExam);

module.exports = examRouter;

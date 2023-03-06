const express = require("express");
const {
  adminRegisterStudent,
  loginStudent,
  getStudentProfile,
  getAllStudentsAdmin,
  getStudentByAdmin,
  studentUpdateProfile,
  adminUpdateStudent,
  writeExam,
} = require("../../controllers/students/studentController");

const isAdmin = require("../../middlewares/isAdmin");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const isStudent = require("../../middlewares/isStudent");
const isStudentLoggedIn = require("../../middlewares/isStudentLoggedIn");

const studentRouter = express.Router();

studentRouter.post(
  "/admin/register",
  isLoggedIn,
  isAdmin,
  adminRegisterStudent
);
studentRouter.post("/login", loginStudent);
studentRouter.get("/profile", isStudentLoggedIn, isStudent, getStudentProfile);
studentRouter.get("/admin", isLoggedIn, isAdmin, getAllStudentsAdmin);
studentRouter.get("/:studentId/admin", isLoggedIn, isAdmin, getStudentByAdmin);
studentRouter.post(
  "/exams/:examId/write",
  isStudentLoggedIn,
  isStudent,
  writeExam
);
studentRouter.put(
  "/:studentId/update",
  isStudentLoggedIn,
  isStudent,
  studentUpdateProfile
);
studentRouter.put(
  "/:studentId/update/admin",
  isLoggedIn,
  isAdmin,
  adminUpdateStudent
);

module.exports = studentRouter;

const express = require("express");
const {
  adminRegisterTeacher,
  loginTeacher,
  getAllTeachersAdmin,
  getTeacherByAdmin,
  getTeacherProfile,
  teacherUpdateProfile,
  adminUpdateTeacher,
} = require("../../controllers/staff/teacherController");
const advancedResults = require("../../middlewares/advancedResults");
const isAdmin = require("../../middlewares/isAdmin");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLoggedIn = require("../../middlewares/isTeacherLoggedIn");

const teacherRouter = express.Router();

teacherRouter.post(
  "/admin/register",
  isLoggedIn,
  isAdmin,
  adminRegisterTeacher
);
teacherRouter.post("/login", loginTeacher);
teacherRouter.get(
  "/admin",
  isLoggedIn,
  isAdmin,
  advancedResults(),
  getAllTeachersAdmin
);
teacherRouter.get("/:teacherId/admin", isLoggedIn, isAdmin, getTeacherByAdmin);
teacherRouter.get("/profile", isTeacherLoggedIn, isTeacher, getTeacherProfile);
teacherRouter.put(
  "/:teacherId/update",
  isTeacherLoggedIn,
  isTeacher,
  teacherUpdateProfile
);
teacherRouter.put(
  "/:teacherId/update/admin",
  isLoggedIn,
  isAdmin,
  adminUpdateTeacher
);

module.exports = teacherRouter;

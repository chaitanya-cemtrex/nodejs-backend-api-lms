const express = require("express");
const {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} = require("../../controllers/academics/academicYearController");
const isAdmin = require("../../middlewares/isAdmin");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const academicYearRouter = express.Router();

// academicYearRouter.post("/", isLoggedIn, isAdmin, createAcademicYear);
// academicYearRouter.get("/", isLoggedIn, isAdmin, getAcademicYears);

academicYearRouter
  .route("/")
  .post(isLoggedIn, isAdmin, createAcademicYear)
  .get(isLoggedIn, isAdmin, getAcademicYears);

academicYearRouter
  .route("/:id")
  .get(isLoggedIn, isAdmin, getAcademicYear)
  .put(isLoggedIn, isAdmin, updateAcademicYear)
  .delete(isLoggedIn, isAdmin, deleteAcademicYear);
// academicYearRouter.get("/:id", isLoggedIn, isAdmin, getAcademicYear);
// academicYearRouter.put("/:id", isLoggedIn, isAdmin, updateAcademicYear);
// academicYearRouter.delete("/:id", isLoggedIn, isAdmin, deleteAcademicYear);

module.exports = academicYearRouter;

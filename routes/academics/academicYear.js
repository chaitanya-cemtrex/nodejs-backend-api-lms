const express = require("express");
const {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
} = require("../../controllers/academics/academicYearController");
const isAdmin = require("../../middlewares/isAdmin");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const academicYearRouter = express.Router();

academicYearRouter.post("/", isLoggedIn, isAdmin, createAcademicYear);
academicYearRouter.get("/", isLoggedIn, isAdmin, getAcademicYears);
academicYearRouter.get("/:id", isLoggedIn, isAdmin, getAcademicYear);

module.exports = academicYearRouter;

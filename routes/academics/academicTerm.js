const express = require("express");
const {
  createAcademicTerm,
  getAcademicTerms,
  getAcademicTerm,
  updateAcademicTerm,
  deleteAcademicTerm,
} = require("../../controllers/academics/academicTermController");
const isAdmin = require("../../middlewares/isAdmin");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const academicTermRouter = express.Router();

// academicTermRouter.post("/", isLoggedIn, isAdmin, createAcademicTerm);
// academicTermRouter.get("/", isLoggedIn, isAdmin, getAcademicTerms);

academicTermRouter
  .route("/")
  .post(isLoggedIn, isAdmin, createAcademicTerm)
  .get(isLoggedIn, isAdmin, getAcademicTerms);

academicTermRouter
  .route("/:id")
  .get(isLoggedIn, isAdmin, getAcademicTerm)
  .put(isLoggedIn, isAdmin, updateAcademicTerm)
  .delete(isLoggedIn, isAdmin, deleteAcademicTerm);
// academicTermRouter.get("/:id", isLoggedIn, isAdmin, getAcademicTerm);
// academicTermRouter.put("/:id", isLoggedIn, isAdmin, updateAcademicTerm);
// academicTermRouter.delete("/:id", isLoggedIn, isAdmin, deleteAcademicTerm);

module.exports = academicTermRouter;

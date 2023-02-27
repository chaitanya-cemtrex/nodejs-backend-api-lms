const express = require("express");
const {
  getProgram,
  getPrograms,
  createProgram,
  deleteProgram,
  updateProgram,
} = require("../../controllers/academics/programsController");

const isAdmin = require("../../middlewares/isAdmin");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const programRouter = express.Router();

// academicTermRouter.post("/", isLoggedIn, isAdmin, createAcademicTerm);
// academicTermRouter.get("/", isLoggedIn, isAdmin, getAcademicTerms);

programRouter.route("/")
  .post(isLoggedIn, isAdmin, createProgram)
  .get(isLoggedIn, isAdmin, getPrograms);

programRouter.route("/:id")
  .get(isLoggedIn, isAdmin, getProgram)
  .put(isLoggedIn, isAdmin, updateProgram)
  .delete(isLoggedIn, isAdmin, deleteProgram);
// academicTermRouter.get("/:id", isLoggedIn, isAdmin, getAcademicTerm);
// academicTermRouter.put("/:id", isLoggedIn, isAdmin, updateAcademicTerm);
// academicTermRouter.delete("/:id", isLoggedIn, isAdmin, deleteAcademicTerm);

module.exports = programRouter;

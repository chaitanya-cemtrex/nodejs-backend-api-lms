const express = require("express");
const {
  getClassLevel,
  createClassLevel,
  deleteClassLevel,
  getClassLevels,
  updateClassLevel,
} = require("../../controllers/academics/classLevelController");

const isAdmin = require("../../middlewares/isAdmin");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const classLevelRouter = express.Router();

// academicTermRouter.post("/", isLoggedIn, isAdmin, createAcademicTerm);
// academicTermRouter.get("/", isLoggedIn, isAdmin, getAcademicTerms);

classLevelRouter
  .route("/")
  .post(isLoggedIn, isAdmin, createClassLevel)
  .get(isLoggedIn, isAdmin, getClassLevels);

classLevelRouter
  .route("/:id")
  .get(isLoggedIn, isAdmin, getClassLevel)
  .put(isLoggedIn, isAdmin, updateClassLevel)
  .delete(isLoggedIn, isAdmin, deleteClassLevel);
// academicTermRouter.get("/:id", isLoggedIn, isAdmin, getAcademicTerm);
// academicTermRouter.put("/:id", isLoggedIn, isAdmin, updateAcademicTerm);
// academicTermRouter.delete("/:id", isLoggedIn, isAdmin, deleteAcademicTerm);

module.exports = classLevelRouter;

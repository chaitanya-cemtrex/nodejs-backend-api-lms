const express = require("express");
const {
  createSubject,
  getSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
} = require("../../controllers/academics/subjectController");

const isAdmin = require("../../middlewares/isAdmin");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const subjectRouter = express.Router();

subjectRouter.post('/:programId', isLoggedIn, isAdmin, createSubject)
subjectRouter.get('/', isLoggedIn, isAdmin, getSubjects)
subjectRouter.get('/:id', isLoggedIn, isAdmin, getSubject)
subjectRouter.put('/:id', isLoggedIn, isAdmin, updateSubject)
subjectRouter.delete('/:id', isLoggedIn, isAdmin, deleteSubject)


module.exports = subjectRouter;

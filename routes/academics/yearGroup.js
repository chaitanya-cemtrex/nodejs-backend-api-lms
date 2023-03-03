const express = require("express");
const {
  createYearGroup,
  deleteYearGroup,
  getYearGroup,
  getYearGroups,
  updateYearGroup,
} = require("../../controllers/academics/yearGroupController");

const isAdmin = require("../../middlewares/isAdmin");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const yearGroupRouter = express.Router();

yearGroupRouter
  .route("/")
  .post(isLoggedIn, isAdmin, createYearGroup)
  .get(isLoggedIn, isAdmin, getYearGroups);

yearGroupRouter
  .route("/:id")
  .get(isLoggedIn, isAdmin, getYearGroup)
  .put(isLoggedIn, isAdmin, updateYearGroup)
  .delete(isLoggedIn, isAdmin, deleteYearGroup);

module.exports = yearGroupRouter;

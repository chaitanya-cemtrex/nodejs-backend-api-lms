const express = require("express")
const { createQuestion } = require("../../controllers/academics/questionController")
const isTeacher = require("../../middlewares/isTeacher")
const isTeacherLoggedIn = require("../../middlewares/isTeacherLoggedIn")


const questionRouter = express.Router()

questionRouter.post('/:examId', isTeacherLoggedIn, isTeacher, createQuestion)

module.exports = questionRouter;
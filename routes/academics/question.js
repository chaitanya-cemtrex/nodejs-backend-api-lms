const express = require("express")
const { createQuestion, getQuestions, getQuestion, updateQuestion } = require("../../controllers/academics/questionController")
const isTeacher = require("../../middlewares/isTeacher")
const isTeacherLoggedIn = require("../../middlewares/isTeacherLoggedIn")


const questionRouter = express.Router()

questionRouter.post('/:examId', isTeacherLoggedIn, isTeacher, createQuestion)
questionRouter.get('/', isTeacherLoggedIn, isTeacher, getQuestions)
questionRouter.get('/:id', isTeacherLoggedIn, isTeacher, getQuestion)
questionRouter.put('/:id', isTeacherLoggedIn, isTeacher, updateQuestion)

module.exports = questionRouter;
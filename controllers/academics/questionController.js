const AsyncHandler = require("express-async-handler");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLoggedIn = require("../../middlewares/isTeacherLoggedIn");
const Exam = require("../../models/Academic/Exam");
const Question = require("../../models/Academic/Questions");
const Teacher = require("../../models/Staff/Teacher");

//@desc Create Question
//@route POST /:examId
//@access Teachers only
exports.createQuestion = AsyncHandler(async (req, res) => {
    const { question, optionA, optionB, optionC, optionD, correctAnswer } = req.body
    //find the exam
    const examFound = await Exam.findById(req.params.examId)
    if (!examFound) {
        throw new Error("Exam not found")
    }
    //create question
    const questionCreated = await Question.create({
        question, optionA, optionB, optionC, optionD, correctAnswer, createdBy: req.userAuth?._id
    })
    //add the question into exam
    examFound.questions.push(questionCreated?._id)
    //save
    await examFound.save()
    res.status(201).json({
        status: "success",
        message: "Question created successfully",
        data: questionCreated
    })
})
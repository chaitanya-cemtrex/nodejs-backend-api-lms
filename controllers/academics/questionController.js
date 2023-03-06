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

    //check if question exists
    const questionExists = await Question.findOne({ question });
    if (questionExists) {
        throw new Error("Question already exists.")
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

//@desc Get all Questions
//@route GET /questions
//@access Private Teachers only
exports.getQuestions = AsyncHandler(async (req, res) => {
    const questions = await Question.find();

    res.status(200).json({
        status: "success",
        message: "Questions fetched successfully.",
        data: questions,
    });
});

//@desc Get single Question
//@route GET /questions
//@access Private Teachers only
exports.getQuestion = AsyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);

    res.status(200).json({
        status: "success",
        message: "Question fetched successfully.",
        data: question,
    });
});

//@desc   Update  Question
//@route  PUT /api/v1/questions/:id
//@acess  Private Teachers only
exports.updateQuestion = AsyncHandler(async (req, res) => {
    const { question, optionA, optionB, optionC, optionD, correctAnswer } = req.body
    //check name exists
    const questionFound = await Question.findOne({ question });
    if (questionFound) {
        throw new Error("Question already exists");
    }
    const questionUpdated = await Question.findByIdAndUpdate(
        req.params.id,
        {
            question, optionA, optionB, optionC, optionD, correctAnswer,
            createdBy: req.userAuth._id,
        },
        {
            new: true,
        }
    );

    res.status(200).json({
        status: "success",
        message: "Question updated successfully",
        data: questionUpdated,
    });
});

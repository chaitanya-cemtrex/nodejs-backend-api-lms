const AsyncHandler = require("express-async-handler");
const Exam = require("../../models/Academic/Exam");
const ExamResult = require("../../models/Academic/ExamResults");
const Student = require("../../models/Academic/Student");
const generateToken = require("../../utils/generateToken");
const { hashPassword, isPasswordMatched } = require("../../utils/helpers");

//@desc Admin registers student
//@route POST /students/admin/register
//@access Admin Only
exports.adminRegisterStudent = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //if teacher already exists
  const studentFound = await Student.findOne({ email });
  if (studentFound) {
    throw new Error("Student already registered");
  }

  //hash password
  const hashedPassword = await hashPassword(password);
  //create teacher
  const studentCreated = await Student.create({
    name,
    email,
    password: hashedPassword,
  });

  //send student data
  res.status(201).json({
    status: "success",
    message: "Student registered successfully",
    data: studentCreated,
  });
});

//@desc Login a student
//@route POST /students/login
//@access Public
exports.loginStudent = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //find the user
  const student = await Student.findOne({ email });
  if (!student) {
    throw new Error("Invalid login credentials");
  }

  //verify the password
  const isMatched = await isPasswordMatched(password, student.password);
  if (!isMatched) {
    throw new Error("Invalid login credentials");
  } else {
    res.status(200).json({
      status: "success",
      message: "Student Logged in successfully.",
      token: generateToken(student?._id),
    });
  }
});

//@desc Student Profile
//@route GET /students/profile
//@access Student only
exports.getStudentProfile = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.userAuth?._id).select(
    "-password -createdAt -updatedAt"
  );
  if (!student) {
    throw new Error("Student Profile not found");
  }
  res.status(200).json({
    status: "success",
    message: "Student Profile fetched successfully",
    data: student,
  });
});

//@desc Get all students
//@route GET /students/admin
//@access Public
exports.getAllStudentsAdmin = AsyncHandler(async (req, res) => {
  const students = await Student.find();
  res.status(200).json({
    status: "success",
    message: "Students fetched successfully",
    data: students,
  });
});

//@desc Get single student
//@route GET /students/:studentId/admin
//@access Public
exports.getStudentByAdmin = AsyncHandler(async (req, res) => {
  const studentId = req.params.studentId;
  //find the teacher
  const student = await Student.findById(studentId);
  if (!student) {
    throw new Error("Student not found");
  }
  res.status(200).json({
    status: "success",
    message: "Student fetched successfully",
    data: student,
  });
});

//@desc Update Student Profile
//@route PUT /students/:studentId/update
//@access Student only
exports.studentUpdateProfile = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //if email is taken
  const emailExist = await Student.findOne({ email });
  if (emailExist) {
    throw new Error("Email is already taken.");
  }

  //check if user is updating password
  if (password) {
    //update with password
    const student = await Student.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        password: await hashPassword(password),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: student,
      message: "Student profile updated successfully",
    });
  } else {
    //update without password
    const student = await Student.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: student,
      message: "Student profile updated successfully",
    });
  }
});

//@desc Admin Update Student eg. assigning classes
//@route PUT /students/:studentId/update/admin
//@access Admin only
exports.adminUpdateStudent = AsyncHandler(async (req, res) => {
  const { classLevels, academicYear, program, name, email, prefectName } =
    req.body;

  // find the student by id
  const studentFound = await Student.findById(req.params.studentId);
  if (!studentFound) {
    throw new Error("Student not found.");
  }

  //update student
  const studentUpdated = await Student.findByIdAndUpdate(
    req.params.studentId,
    {
      $set: {
        name,
        email,
        academicYear,
        program,
        prefectName,
      },
      $addToSet: {
        classLevels,
      },
    },
    {
      new: true,
    }
  );
  //send response
  res.status(200).json({
    status: "success",
    data: studentUpdated,
    message: "Student profile updated successfully by admin",
  });
});

//@desc Students taking exam
//@route PUT /students/exams/:examId/write
//@access Students only
exports.writeExam = AsyncHandler(async (req, res) => {
  //get student
  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
    throw new Error("Student not found.");
  }
  //get exam
  const examFound = await Exam.findById(req.params.examId).populate("questions");
  if (!examFound) {
    throw new Error("Exam not found.");
  }

  //get questions
  const questions = examFound?.questions

  //get answers by student
  const studentAnswers = req.body.answers;

  //check if student answered all the questions
  if (studentAnswers.length !== questions.length) {
    throw new Error("You have not answered all the questions.");
  }

  //check if student has already taken the examination
  const studentFoundInExamResults = await ExamResult.findOne({ student: studentFound?._id })
  if (studentFoundInExamResults) {
    throw new Error("You have already written this exam");
  }

  //build report object
  let correctAnswers = 0
  let wrongAnswers = 0
  let status = ""   //// failed or pass 
  let totalQuestions = 0
  let grade = 0
  let remarks = ""
  let score = 0
  let answeredQuestions = []

  //check for answers
  for (let i = 0; i < questions.length; i++) {
    //find the question
    const question = questions[i]
    //check if the answers is correcct
    if (question.correctAnswer === studentAnswers[i]) {
      correctAnswers++
      score++
      question.isCorrect = true
    } else {
      wrongAnswers++

    }
  }


  //calculate reports
  totalQuestions = questions.length
  grade = (correctAnswers / totalQuestions) * 100
  answeredQuestions = questions.map(question => {
    return {
      question: question.question,
      correctAnswer: question.correctAnswer,
      isCorrect: question.isCorrect
    }
  })
  //calculate status
  if (grade >= 50) {
    status = "Pass"
  } else {
    status = "Fail"
  }

  //remarks
  if (grade >= 80) {
    remarks = "Excellent"
  } else if (grade >= 70) {
    remarks = "Very Good"
  } else if (grade >= 60) {
    remarks = "Good"
  } else if (grade >= 50) {
    remarks = "Fair"
  } else {
    remarks = "Poor"
  }

  //generate exam result
  const examResults = await ExamResult.create({
    student: studentFound?._id,
    exam: examFound?._id,
    grade,
    score,
    status,
    remarks,
    classLevel: examFound?.classLevel,
    academicTerm: examFound?.academicTerm,
    academicYear: examFound?.academicYear
  });
  //push results into student
  studentFound.examResults.push(examResults?._id)
  //save
  await studentFound.save()
  res.status(200).json({
    status: "success",
    correctAnswers, wrongAnswers, score, grade, answeredQuestions, status, remarks, examResults
  })
})
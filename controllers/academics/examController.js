const AsyncHandler = require("express-async-handler");
const Exam = require("../../models/Academic/Exam");
const Teacher = require("../../models/Staff/Teacher");

//@desc Create exam
//@route POST /exams
//@access Teacher only
exports.createExam = AsyncHandler(async (req, res) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    createdBy,
    classLevel,
    academicYear,
  } = req.body;

  //find teacher
  console.log("User Id from req =>", req.userAuth);
  const teacherFound = await Teacher.findById(req.userAuth?._id);
  if (!teacherFound) {
    throw new Error("Teacher not found");
  }

  //exam exists
  const examExists = await Exam.findOne({ name });
  if (examExists) {
    throw new Error("Exam already exists");
  }
  //crete the exam
  const examCreated = new Exam({
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    classLevel,
    examDate,
    examTime,
    examType,
    academicYear,
    createdBy: req.userAuth?._id,
  });
  //push the exam into teacher
  teacherFound.examsCreated.push(examCreated._id);
  //save exam
  await examCreated.save();
  await teacherFound.save();

  res.status(201).json({
    status: "success",
    message: "Exam created successfully",
    data: examCreated,
  });
});

//@desc Get all Exams
//@route GET /exams
//@access Private
exports.getExams = AsyncHandler(async (req, res) => {
  const exams = await Exam.find().populate({
    path: "questions",
    populate: {
      path: "createdBy",
    },
  });

  res.status(201).json({
    status: "success",
    message: "Exams fetched successfully.",
    data: exams,
  });
});

//@desc Get single Exam
//@route GET /exams/:id
//@access Private
exports.getExam = AsyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Exam fetched successfully.",
    data: exam,
  });
});

//@desc   Update  exam
//@route  PUT /api/v1/exams/:id
//@acess  Private
exports.updateExam = AsyncHandler(async (req, res) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    createdBy,
    classLevel,
    academicYear,
  } = req.body;
  //check name exists
  const examFound = await Exam.findOne({ name });
  if (examFound) {
    throw new Error("Exam already exists");
  }
  const examUpdated = await Exam.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      subject,
      program,
      academicTerm,
      duration,
      examDate,
      examTime,
      examType,
      classLevel,
      academicYear,
      createdBy: req.userAuth?._id,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Exam updated successfully",
    data: examUpdated,
  });
});

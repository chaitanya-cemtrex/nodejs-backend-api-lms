const AsyncHandler = require("express-async-handler");
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
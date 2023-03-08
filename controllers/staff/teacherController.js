const AsyncHandler = require("express-async-handler");
const Teacher = require("../../models/Staff/Teacher");
const { hashPassword, isPasswordMatched } = require("../../utils/helpers");
const generateToken = require("../../utils/generateToken");


//@desc Admin registers teacher
//@route POST /teachers/admin/register
//@access Private
exports.adminRegisterTeacher = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //if teacher already exists
  const teacherFound = await Teacher.findOne({ email });
  if (teacherFound) {
    throw new Error("Teacher already employed");
  }

  //hash password
  const hashedPassword = await hashPassword(password);
  //create teacher
  const teacherCreated = await Teacher.create({
    name,
    email,
    password: hashedPassword,
  });

  //send teacher data
  res.status(201).json({
    status: "success",
    message: "Teacher registered successfully",
    data: teacherCreated,
  });
});

//@desc Login a teacher
//@route POST /teachers/login
//@access Public
exports.loginTeacher = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //find the user
  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    throw new Error("Invalid login credentials");
  }

  //verify the password
  const isMatched = await isPasswordMatched(password, teacher.password);
  if (!isMatched) {
    throw new Error("Invalid login credentials");
  } else {
    res.status(200).json({
      status: "success",
      message: "Teacher Logged in successfully.",
      token: generateToken(teacher?._id),
    });
  }
});

//@desc Get all teachers
//@route GET /teachers/admin
//@access Public
exports.getAllTeachersAdmin = AsyncHandler(async (req, res) => {
  res.status(200).json(res.result)
});

//@desc Get single teacher
//@route GET /teachers/:teacherId/admin
//@access Public
exports.getTeacherByAdmin = AsyncHandler(async (req, res) => {
  const teacherId = req.params.teacherId;
  //find the teacher
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    throw new Error("Teacher not found");
  }
  res.status(200).json({
    status: "success",
    message: "Teacher fetched successfully",
    data: teacher,
  });
});

//@desc Teacher Profile
//@route GET /teachers/profile
//@access Teacher only
exports.getTeacherProfile = AsyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.userAuth?._id).select(
    "-password -createdAt -updatedAt"
  );
  if (!teacher) {
    throw new Error("Teacher Profile not found");
  }
  res.status(200).json({
    status: "success",
    message: "Teacher Profile fetched successfully",
    data: teacher,
  });
});

//@desc Update Teacher Profile
//@route PUT /teachers/:teacherId/update
//@access Teacher only
exports.teacherUpdateProfile = AsyncHandler(async (req, res) => {
  const { email, name, password } = req.body;
  //if email is taken
  const emailExist = await Teacher.findOne({ email });
  if (emailExist) {
    throw new Error("Email is already taken.");
  }

  //check if user is updating password
  if (password) {
    //update with password
    const teacher = await Teacher.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        password: await hashPassword(password),
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: teacher,
      message: "Teacher profile updated successfully",
    });
  } else {
    //update without password
    const teacher = await Teacher.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: teacher,
      message: "Teacher profile updated successfully",
    });
  }
});

//@desc Admin updating teacher profile
//@route PUT /teachers/:teacherId/update/admin
//@access Admin only
exports.adminUpdateTeacher = AsyncHandler(async (req, res) => {
  const { program, classLevel, academicYear, subject } = req.body;

  //find teacher
  const teacherFound = await Teacher.findById(req.params.teacherId);
  if (!teacherFound) {
    throw new Error("Teacher not found");
  }

  //check is teacher is withdrawn
  if (teacherFound.isWitdrawn) {
    throw new Error("Action Denied. Teacher is withdrawn");
  }

  //assign a program
  if (program) {
    teacherFound.program = program;
    await teacherFound.save();
  }
  //assign a classLevel
  if (classLevel) {
    teacherFound.classLevel = classLevel;
    await teacherFound.save();
  }
  //assign a academicYear
  if (academicYear) {
    teacherFound.academicYear = academicYear;
    await teacherFound.save();
  }
  //assign a subject
  if (subject) {
    teacherFound.subject = subject;
    await teacherFound.save();
  }

  res.status(200).json({
    status: "success",
    data: teacherFound,
    message: "Teacher profile updated successfully",
  });
});

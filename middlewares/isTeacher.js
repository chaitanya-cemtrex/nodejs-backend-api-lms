const Teacher = require("../models/Staff/Teacher");

const isTeacher = async (req, res, next) => {
  //find the user
  const userId = req?.userAuth?._id;
  const teacherFound = await Teacher.findById(userId);
  //check if admin
  if (teacherFound?.role === "teacher") {
    next();
  } else {
    next(new Error("Access denied. Teachers only route."));
  }
};

module.exports = isTeacher;

const AsyncHandler = require("express-async-handler");
const AcademicYear = require("../../models/Academic/AcademicYear");


//@desc Create academic year
//@route POST /academic-years
//@access Private
exports.createAcademicYear = AsyncHandler(async (req, res) => {
  const { name, fromYear, toYear, isCurrent, createdBy } = req.body;
  //check if exists
  const academicYear = await AcademicYear.findOne({ name });
  if (academicYear) {
    throw new Error("Academic Year Already exists.");
  }
  //create
  const academicYearCreated = await AcademicYear.create({
    name,
    fromYear,
    toYear,
    createdBy: req.userAuth._id,
  });
  res.status(201).json({
    status: "success",
    message: "Academic Year created successfully.",
    data: academicYearCreated,
  });
});


//@desc Get all academic years
//@route GET /academic-years
//@access Private
exports.getAcademicYears = AsyncHandler(async (req, res) => {
    
   const academicYears = await AcademicYear.find()


    res.status(201).json({
      status: "success",
      message: "Academic Years fetched successfully.",
      data: academicYears,
    });
  });

//@desc Get single academic year
//@route GET /academic-years/:id
//@access Private
exports.getAcademicYear = AsyncHandler(async (req, res) => {
    
    const academicYears = await AcademicYear.findById(req.params.id)
 
 
     res.status(201).json({
       status: "success",
       message: "Academic Years fetched successfully.",
       data: academicYears,
     });
   });
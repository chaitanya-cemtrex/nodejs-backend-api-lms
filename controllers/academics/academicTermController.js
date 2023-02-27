const AsyncHandler = require("express-async-handler");
const AcademicTerm = require("../../models/Academic/AcademicTerm");
const Admin = require("../../models/Staff/Admin");

//@desc Create academic term
//@route POST /academic-terms
//@access Private
exports.createAcademicTerm = AsyncHandler(async (req, res) => {
  const { name, description, duration } = req.body;
  //check if exists
  const academicTerm = await AcademicTerm.findOne({ name });
  if (academicTerm) {
    throw new Error("Academic Term Already exists.");
  }
  //create
  const academicTermCreated = await AcademicTerm.create({
    name,
    description,
    duration,
    createdBy: req.userAuth._id,
  });
  //push academic term into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.academicTerms.push(academicTermCreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Academic Term created successfully.",
    data: academicTermCreated,
  });
});

//@desc Get all academic terms
//@route GET /academic-terms
//@access Private
exports.getAcademicTerms = AsyncHandler(async (req, res) => {
  const academicTerms = await AcademicTerm.find();

  res.status(201).json({
    status: "success",
    message: "Academic Terms fetched successfully.",
    data: academicTerms,
  });
});

//@desc Get single academic term
//@route GET /academic-terms/:id
//@access Private
exports.getAcademicTerm = AsyncHandler(async (req, res) => {
  const academicTerms = await AcademicTerm.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Academic Term fetched successfully.",
    data: academicTerms,
  });
});

//@desc   Update  Academic term
//@route  PUT /api/v1/academic-terms/:id
//@acess  Private
exports.updateAcademicTerm = AsyncHandler(async (req, res) => {
  const { name, description, duration } = req.body;
  //check name exists
  const createAcademicTermFound = await AcademicTerm.findOne({ name });
  if (createAcademicTermFound) {
    throw new Error("Academic term already exists");
  }
  const academicTerms = await AcademicTerm.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      duration,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Academic term updated successfully",
    data: academicTerms,
  });
});

//@desc Delete academic term
//@route DELETE /academic-terms/:id
//@access Private
exports.deleteAcademicTerm = AsyncHandler(async (req, res) => {
  await AcademicTerm.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Academic Term deleted successfully.",
  });
});

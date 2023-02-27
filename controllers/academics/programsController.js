const AsyncHandler = require("express-async-handler");
const Program = require("../../models/Academic/Program");
const Admin = require("../../models/Staff/Admin");

//@desc Create program
//@route POST /programs
//@access Private
exports.createProgram = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //check if exists
  const programFound = await Program.findOne({ name });
  if (programFound) {
    throw new Error("Program Already exists.");
  }
  //create
  const programCreated = await Program.create({
    name,
    description,
    createdBy: req.userAuth._id,
  });
  //push Program into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.programs.push(programCreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Program created successfully.",
    data: programCreated,
  });
});

//@desc Get all Programs
//@route GET /class-levels
//@access Private
exports.getPrograms = AsyncHandler(async (req, res) => {
  const programs = await Program.find();

  res.status(201).json({
    status: "success",
    message: "Programs fetched successfully.",
    data: programs,
  });
});

//@desc Get single Program
//@route GET /class-levels/:id
//@access Private
exports.getProgram = AsyncHandler(async (req, res) => {
  const program = await Program.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Program fetched successfully.",
    data: program,
  });
});

//@desc   Update  Program
//@route  PUT /api/v1/class-levels/:id
//@acess  Private
exports.updateProgram = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //check name exists
  const createProgramFound = await Program.findOne({ name });
  if (createProgramFound) {
    throw new Error("Program already exists");
  }
  const programs = await Program.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Program updated successfully",
    data: programs,
  });
});

//@desc Delete Program
//@route DELETE /class-levels/:id
//@access Private
exports.deleteProgram = AsyncHandler(async (req, res) => {
  await Program.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Program deleted successfully.",
  });
});

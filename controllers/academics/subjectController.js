const AsyncHandler = require("express-async-handler");
const Program = require("../../models/Academic/Program");
const Subject = require("../../models/Academic/Subject");
const Admin = require("../../models/Staff/Admin");

//@desc Create subject
//@route POST /subjects
//@access Private
exports.createSubject = AsyncHandler(async (req, res) => {
  const { name, description, academicTerm } = req.body;
  //find the program
  const programFound = await Program.findById(req.params.programId);
  if (!programFound) {
    throw new Error("Program not found.");
  }
  //check if exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    throw new Error("Subject Already exists.");
  }
  //create
  const subjectCreated = await Subject.create({
    name,
    description,
    academicTerm,
    createdBy: req.userAuth._id,
  });
  //push subject into program
  programFound.subjects.push(subjectCreated._id);
  await programFound.save();
  res.status(201).json({
    status: "success",
    message: "Program created successfully.",
    data: subjectCreated,
  });
});

//@desc Get all Subjects
//@route GET /subjects
//@access Private
exports.getSubjects = AsyncHandler(async (req, res) => {
  const subjects = await Subject.find();

  res.status(201).json({
    status: "success",
    message: "Subjects fetched successfully.",
    data: subjects,
  });
});

//@desc Get single Subject
//@route GET /subjects/:id
//@access Private
exports.getSubject = AsyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Subject fetched successfully.",
    data: subject,
  });
});

//@desc   Update  subject
//@route  PUT /api/v1/subjects/:id
//@acess  Private
exports.updateSubject = AsyncHandler(async (req, res) => {
  const { name, description, academicTerm } = req.body;
  //check name exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    throw new Error("Subject already exists");
  }
  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      academicTerm,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Subject updated successfully",
    data: subject,
  });
});

//@desc Delete Subject
//@route DELETE /subjects/:id
//@access Private
exports.deleteSubject = AsyncHandler(async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Subject deleted successfully.",
  });
});

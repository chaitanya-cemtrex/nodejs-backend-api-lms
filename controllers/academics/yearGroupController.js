const AsyncHandler = require("express-async-handler");
const Program = require("../../models/Academic/Program");
const YearGroup = require("../../models/Academic/YearGroup");
const Admin = require("../../models/Staff/Admin");

//@desc Create year-group
//@route POST /year-groups
//@access Private
exports.createYearGroup = AsyncHandler(async (req, res) => {
  const { name, academicYear } = req.body;

  //check if exists
  const yearGroupFound = await YearGroup.findOne({ name });
  if (yearGroupFound) {
    throw new Error("Year group Already exists.");
  }
  //create
  const yearGroupCreated = await YearGroup.create({
    name,
    academicYear,
    createdBy: req.userAuth._id,
  });
  //push yearGroup into admin
  const admin = await Admin.findById(req.userAuth._id);
  if (!admin) {
    throw new Error("Admin not found");
  }
  admin.yearGroups.push(yearGroupCreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Year group created successfully.",
    data: yearGroupCreated,
  });
});

//@desc Get all year groups
//@route GET /year-groups
//@access Private
exports.getYearGroups = AsyncHandler(async (req, res) => {
  const yearGroups = await YearGroup.find();

  res.status(200).json({
    status: "success",
    message: "Subjects fetched successfully.",
    data: yearGroups,
  });
});

//@desc Get single Subject
//@route GET /year-groups/:id
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
//@route  PUT /api/v1/year-groups/:id
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
//@route DELETE /year-groups/:id
//@access Private
exports.deleteSubject = AsyncHandler(async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Subject deleted successfully.",
  });
});

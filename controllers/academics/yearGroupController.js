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

//@desc Get single year group
//@route GET /year-groups/:id
//@access Private
exports.getYearGroup = AsyncHandler(async (req, res) => {
  const yearGroups = await YearGroup.findById(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Year Group fetched successfully.",
    data: yearGroups,
  });
});

//@desc   Update  year group
//@route  PUT /api/v1/year-groups/:id
//@acess  Private
exports.updateYearGroup = AsyncHandler(async (req, res) => {
  const { name, academicYear } = req.body;
  //check name exists
  const yearGroupFound = await YearGroup.findOne({ name });
  if (yearGroupFound) {
    throw new Error("year group already exists");
  }
  const yearGroup = await YearGroup.findByIdAndUpdate(
    req.params.id,
    {
      name,
      academicYear,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Year group updated successfully",
    data: yearGroup,
  });
});

//@desc Delete year group
//@route DELETE /year-groups/:id
//@access Private
exports.deleteYearGroup = AsyncHandler(async (req, res) => {
  await YearGroup.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Year group deleted successfully.",
  });
});

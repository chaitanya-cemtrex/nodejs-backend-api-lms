const AsyncHandler = require("express-async-handler");
const ClassLevel = require("../../models/Academic/ClassLevel");
const Admin = require("../../models/Staff/Admin");

//@desc Create class level
//@route POST /class-levels
//@access Private
exports.createClassLevel = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //check if exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    throw new Error("Class level Already exists.");
  }
  //create
  const classCreated = await ClassLevel.create({
    name,
    description,
    createdBy: req.userAuth._id,
  });
  //push class level into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.classLevels.push(classCreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Class Level created successfully.",
    data: classCreated,
  });
});

//@desc Get all class levels
//@route GET /class-levels
//@access Private
exports.getClassLevels = AsyncHandler(async (req, res) => {
  const classLevels = await ClassLevel.find();

  res.status(201).json({
    status: "success",
    message: "Class Levels fetched successfully.",
    data: classLevels,
  });
});

//@desc Get single class level
//@route GET /class-levels/:id
//@access Private
exports.getClassLevel = AsyncHandler(async (req, res) => {
  const classLevels = await ClassLevel.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Class levels fetched successfully.",
    data: classLevels,
  });
});

//@desc   Update  Class level
//@route  PUT /api/v1/class-levels/:id
//@acess  Private
exports.updateClassLevel = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //check name exists
  const createClassLevelFound = await ClassLevel.findOne({ name });
  if (createClassLevelFound) {
    throw new Error("Class Level already exists");
  }
  const classLevels = await ClassLevel.findByIdAndUpdate(
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
    message: "Class level updated successfully",
    data: classLevels,
  });
});

//@desc Delete class level
//@route DELETE /class-levels/:id
//@access Private
exports.deleteClassLevel = AsyncHandler(async (req, res) => {
  await ClassLevel.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Class level deleted successfully.",
  });
});

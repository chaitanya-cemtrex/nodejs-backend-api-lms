const AsyncHandler = require("express-async-handler");
const Admin = require("../../models/Staff/Admin");

//@desc Register admin
//@route POST /admins/register
//@access Private
exports.registerAdmin = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //check if email exists
  const adminFound = await Admin.findOne({ email });
  if (adminFound) {
    throw new Error("Admin is already registered");
  }

  //register
  const user = await Admin.create({
    name,
    email,
    password,
  });
  res.status(201).json({
    status: "success",
    data: user,
  });
});

//@desc Login admin
//@route POST /admins/login
//@access Private
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    //find user
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.json({
        message: "User not found",
      });
    }

    if (user && (await user.verifyPassword(password))) {
      return res.json({
        data: user,
      });
    } else {
      return res.json({
        message: "Invalid login credentials",
      });
    }
  } catch (error) {
    res.json({
      status: "failed",
      data: error.message,
    });
  }
};

//@desc Get all admins
//@route POST /admins
//@access Private
exports.getAllAdmins = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "All admins",
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error.message,
    });
  }
};

//@desc Get single admin by Id
//@route GET /admins/:id
//@access Private
exports.getAdmin = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "Single admin",
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error.message,
    });
  }
};

//@desc Update single admin by Id
//@route PUT /admins/:id
//@access Private
exports.updateAdmin = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "Update admin",
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error.message,
    });
  }
};

//@desc Delete single admin by Id
//@route DELETE /admins/:id
//@access Private
exports.deleteAdmin = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "Delete admin",
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error.message,
    });
  }
};

//@desc Admin suspend teacher
//@route put /admins/suspend/teachers/:id
//@access Private
exports.adminSuspendTeacher = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin suspend teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error.message,
    });
  }
};

//@desc Admin unsuspend teacher
//@route put /admins/unsuspend/teachers/:id
//@access Private
exports.adminUnsuspendTeacher = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin unsuspend teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error.message,
    });
  }
};

//@desc Admin withdraw teacher
//@route put /admins/withdraw/teachers/:id
//@access Private
exports.adminWithdrawTeacher = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin withdraw teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error.message,
    });
  }
};

//@desc Admin unwithdraw teacher
//@route put /admins/unwithdraw/teachers/:id
//@access Private
exports.adminUnwithdrawTeacher = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin unwithdraw teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error.message,
    });
  }
};

//@desc Admin publish exam
//@route put /admins/publish/exam/:id
//@access Private
exports.adminPublishExam = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin publish exam results",
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error.message,
    });
  }
};

//@desc Admin unpublish exam
//@route put /admins/unpublish/exam/:id
//@access Private
exports.adminUnpublishExam = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin unpublish exam results",
    });
  } catch (error) {
    res.json({
      status: "failed",
      data: error.message,
    });
  }
};

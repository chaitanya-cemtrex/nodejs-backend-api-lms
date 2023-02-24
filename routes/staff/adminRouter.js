const express = require("express");
const {
  registerAdmin,
  adminPublishExam,
  adminSuspendTeacher,
  adminUnpublishExam,
  adminUnsuspendTeacher,
  adminUnwithdrawTeacher,
  adminWithdrawTeacher,
  deleteAdmin,
  getAdminProfile,
  getAllAdmins,
  loginAdmin,
  updateAdmin,
} = require("../../controllers/staff/adminController");
const isAdmin = require("../../middlewares/isAdmin");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const adminRouter = express.Router();

adminRouter.post("/register", registerAdmin);

//admin login
adminRouter.post("/login", loginAdmin);

//get all admins
adminRouter.get("/", isLoggedIn, isAdmin, getAllAdmins);

//get single admin
adminRouter.get("/profile", isLoggedIn, isAdmin, getAdminProfile);

//update admin
adminRouter.put("/", isLoggedIn, isAdmin, updateAdmin);

//delete admin
adminRouter.delete("/:id", deleteAdmin);

//admin suspending teacher
adminRouter.put("/suspend/teachers/:id", adminSuspendTeacher);

//admin unsuspending teacher
adminRouter.put("/unsuspend/teachers/:id", adminUnsuspendTeacher);

//admin withdrawing teacher
adminRouter.put("/withdraw/teachers/:id", adminWithdrawTeacher);

//admin unwithdraw teacher
adminRouter.put("/unwithdraw/teachers/:id", adminUnwithdrawTeacher);

//admin publish exam result
adminRouter.put("/publish/exam/:id", adminPublishExam);

//admin unpublish exam result
adminRouter.put("/unpublish/exam/:id", adminUnpublishExam);

module.exports = adminRouter;

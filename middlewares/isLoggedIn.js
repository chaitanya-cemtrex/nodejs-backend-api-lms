const Admin = require("../models/Staff/Admin");
const verifyToken = require("../utils/verifyToken");

const isLoggedIn = async (req, res, next) => {
  //get token from header
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1]

  //verify the token
  const verifiedToken = verifyToken(token);
  if (verifiedToken) {
    //find the user
    const user = await Admin.findById(verifiedToken.id).select(
      "name email role"
    );
    //save user into request object
    req.userAuth = user;
    next();
  } else {
    const error = new Error("Token expired or Invalid Token");
    next(error);
  }
};

module.exports = isLoggedIn;

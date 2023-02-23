const express = require("express");
const morgan = require("morgan");
const {globalErrorHandler, notFoundError} = require("../middlewares/globalErrorHandler");
const adminRouter = require("../routes/staff/adminRouter");

const app = express();

//middlewares
app.use(morgan("dev"));
app.use(express.json()); ///pass incoming json data

//Routes
app.use("/api/v1/admins", adminRouter);

//error handler middlewares
app.use(notFoundError);
app.use(globalErrorHandler);

module.exports = app;

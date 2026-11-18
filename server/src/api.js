const express = require("express");

const taskRoute = require("../src/features/task/task.route");
const authRoute = require("./features/auth/auth.route");
const allRoutes = express.Router();
allRoutes.use("/task", taskRoute);
allRoutes.use("/auth", authRoute);

module.exports = allRoutes;

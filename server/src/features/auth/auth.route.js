const express = require("express");
const authRoute = express.Router();
const authController = require("./auth.controller");
const { auth } = require("../../middleware/auth.middleware");

authRoute.post("/signup", authController.signup);
authRoute.post("/login", authController.login);
authRoute.get("/me", auth, authController.me);

module.exports = authRoute;

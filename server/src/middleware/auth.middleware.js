const jwt = require("jsonwebtoken");
const AppError = require("../utils/app-error");

const SECRET = process.env.JWT_SECRET || "classroom-secret-not-for-production";

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  if (!token) {
    throw new AppError("Please log in first", 401);
  }
  req.user = jwt.verify(token, SECRET);
  next();
}

module.exports = { auth, SECRET };

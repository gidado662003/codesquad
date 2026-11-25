const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../../utils/app-error");
const User = require("../../models/user.model");
const { SECRET } = require("../../middleware/auth.middleware");

function publicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email };
}

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), name: user.name, email: user.email },
    SECRET,
    { expiresIn: "1h" },
  );
}

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required", 400);
  }
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("That email is already registered", 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: passwordHash });
  res.json({
    success: true,
    response: { token: signToken(user), user: publicUser(user) },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Wrong email or password", 400);
  }
  res.json({
    success: true,
    response: { token: signToken(user), user: publicUser(user) },
  });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json({ success: true, response: { user: publicUser(user) } });
};

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/codesquad");
  console.log("database running successfully");
};

module.exports = connectDB;

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/codesquad");
    console.log("database running successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;

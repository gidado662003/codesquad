const mongoose = require("mongoose");
const authSchema = new mongoose.Schema({});

const Auth = mongoose.model("auth", authSchema);
module.exports = Auth;

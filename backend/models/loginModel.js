const mongoose = require("mongoose");

const loginDetailSchema = new mongoose.Schema({
    userID: String,
    password: String,
    otp: Number
  });
module.exports = mongoose.model("login_details", loginDetailSchema);
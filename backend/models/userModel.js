const mongoose = require("mongoose");

const userDetailSchema = new mongoose.Schema({
  userID: String,
  firstName: String,
  lastName: String,
  dob: String,
  mailID: String,
  phone: String,
  gender: String,
  userType: String,
});

module.exports = mongoose.model("user_details", userDetailSchema);
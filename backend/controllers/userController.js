const bcrypt = require('bcrypt');
const UserDetails = require("../models/userModel");
const LoginDetail = require("../models/loginModel");
const nodemailer = require("nodemailer");
require('dotenv').config({ path: '../../.env' });

exports.addUser = async (req, res) => {
  try {
    const { userID, firstName, lastName, dob, mailID, phone, gender, userType, password } = req.body;

    // Check if the user already exists
    const existingUser = await UserDetails.findOne({ userID });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in UserDetails collection
    const newUser = new UserDetails({
      userID,
      firstName,
      lastName,
      dob,
      mailID,
      phone,
      gender,
      userType
    });
    await newUser.save();

    // Create a new login entry for the user in LoginDetail collection with hashed password
    const newLoginDetail = new LoginDetail({
      userID,
      password: hashedPassword
    });
    await newLoginDetail.save();

    res.status(200).json({ message: "User added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { userID, password } = req.body;
    console.log(userID, password); // Use console.log instead of print

    const user = await LoginDetail.findOne({ userID });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Fetch user details from user_details collection
    const userDetails = await UserDetails.findOne({ userID });
    if (!userDetails) {
      return res.status(401).json({ error: "User details not found" });
    }
    
    res.status(200).json({ message: "Login successful", userDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// dbConnection.js

const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
 try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
 } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
 }
};

module.exports = connectDB;
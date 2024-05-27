const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();
const allRoutes = require("./routers/allRoutes");
const app = express();
const dbConnect = require("./db/dbConnection");

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));
console.log("HI",path.join(__dirname, "..", "frontend", "build", "index.html"));
// Routes
app.use(allRoutes);


// Catch-all route to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});

// Database connection
dbConnect();

// Port configuration
const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

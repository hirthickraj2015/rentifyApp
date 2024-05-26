const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();
const allRoutes = require("./routers/allRoutes");
const app = express();
const dbConnect = require("./db/dbConnection");


app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(allRoutes);
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });

dbConnect();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
 
});


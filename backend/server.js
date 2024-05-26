const express = require("express");
const cors = require("cors");
require('dotenv').config();
const allRoutes = require("./routers/allRoutes");
const app = express();
const dbConnect = require("./db/dbConnection");


app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(allRoutes);


dbConnect();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
 
});


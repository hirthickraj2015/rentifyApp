const jwt = require('jsonwebtoken');
require("dotenv").config();

function authenticateJWT(req, res, next) {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: "Authentication error: Token required" });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Authentication error: Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

module.exports = authenticateJWT;

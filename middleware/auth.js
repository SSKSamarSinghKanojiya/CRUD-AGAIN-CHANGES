
// const jwt = require("jsonwebtoken");

// const authenticateJWT = (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token) {
//     return res.status(401).json({ message: "Access Denied! No token provided" });
//   }

//   try {
//     const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (error) {
//     res.status(400).json({ message: "Invalid Token" });
//   }
// };

// module.exports = authenticateJWT;

const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../model/TokenBlacklist");

const authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  // Check if token is blacklisted
  const blacklisted = await TokenBlacklist.findOne({ token });
  if (blacklisted) {
    return res.status(401).json({ message: "Token is invalid. Please log in again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};


module.exports = authenticateJWT;

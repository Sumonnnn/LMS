const jwt = require("jsonwebtoken");
const User = require("../models/User");
exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

exports.instructorAuth = async (req, res, next) => {
  try {
    if (req.user && (req.user.role === "instructor" || req.user.role === "admin")) {
      next();
    } else {
      return res.status(403).json({ msg: "Access denied: Instructors only" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied: Admins only" });
    }
    next();
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};



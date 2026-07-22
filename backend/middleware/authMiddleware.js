const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. User not found",
      });
    }

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      workspaceName: user.workspaceName,
      role: user.role,
      userType: user.userType,
      isActive: user.isActive,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    return res.status(401).json({
      success: false,
      message: "Not authorized. Invalid or expired token",
    });
  }
};

module.exports = protect;
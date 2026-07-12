const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const sendResetEmail = require("../utils/sendResetEmail");

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  workspaceName: user.workspaceName,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, workspaceName } = req.body;

    // ===== basic validation =====
    if (!name || !email || !password || !workspaceName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedWorkspace = workspaceName.trim();

    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (trimmedWorkspace.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Workspace name must be at least 2 characters",
      });
    }

    // ===== duplicate email check =====
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // ===== hash password =====
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      workspaceName: trimmedWorkspace,
      role: "admin",
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);

    // handle mongoose duplicate key just in case
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while creating account",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while logging in",
    });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    console.error("GetMe error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};


// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    // Don't reveal whether account exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;

    user.passwordResetExpires =
      Date.now() + 15 * 60 * 1000;

    await user.save();
        const resetLink =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendResetEmail(
      user.email,
      user.name,
      resetLink
    );

    return res.status(200).json({
      success: true,
      message:
        "If an account exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to process your request.",
    });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,

      passwordResetExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Reset link is invalid or has expired.",
      });
    }

    const bcrypt = require("bcryptjs");

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(
      password,
      salt
    );
        user.passwordResetToken = null;

    user.passwordResetExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to reset password.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
};
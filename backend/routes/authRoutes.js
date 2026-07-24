const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post( "/forgot-password",forgotPassword);
router.post( "/reset-password/:token",resetPassword);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);

module.exports = router;
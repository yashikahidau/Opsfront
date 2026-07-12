const express = require("express");

const {
  getDashboardOverview,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

// Dashboard Overview
router.get("/", getDashboardOverview);

module.exports = router;
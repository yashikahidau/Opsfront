const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getAnalytics,
  exportAnalytics,
} = require("../controllers/analyticsController");

router.get(
  "/",
  protect,
  getAnalytics
);

router.get(
  "/export",
  protect,
  exportAnalytics
);

module.exports = router;
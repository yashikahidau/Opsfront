const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getQueue,
} = require("../controllers/queueController");

router.get(
  "/",
  protect,
  getQueue
);

module.exports = router;
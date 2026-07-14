const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getAgents,
} = require("../controllers/userController");

router.get(
  "/",
  protect,
  getAgents
);

module.exports = router;
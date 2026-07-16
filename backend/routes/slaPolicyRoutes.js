const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getSlaDashboard,
  exportPolicies,
  updatePolicy,
} = require("../controllers/slaPolicyController");

router.get(
  "/",
  protect,
  getSlaDashboard
);

router.get(
  "/export",
  protect,
  exportPolicies
);

router.put(
  "/:id",
  protect,
  updatePolicy
);

module.exports = router;
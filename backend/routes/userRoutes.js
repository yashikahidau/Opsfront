const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

const {
  getAgents,
  getUsers,
  updateRole,
  getAssignedTickets,
  reassignTickets,
  createAgent,
} = require("../controllers/userController");

// Used by Ticket Assignment dialog
router.get(
  "/agents",
  protect,
  getAgents
);

// Used by Agents Management page
router.get(
  "/",
  protect,
  getUsers
);

//Assigned tickets
router.get(
  "/:id/tickets",
  protect,
  getAssignedTickets
);

//Reassign role
router.patch(
  "/reassign",
  protect,
  reassignTickets
);

// Change user role
router.patch(
  "/:id/role",
  protect,
  updateRole
);

//Add new Agent
router.post(
  "/",
  protect,
  authorize("owner"),
  createAgent
);

module.exports = router;
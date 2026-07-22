const authorize = require("../middleware/authorize");
const express = require("express");

const {
  createTicket,
  getTickets,
  getTicketById,
  assignTicket,
  updateTicket,
  deleteTicket,
  updateTicketStatus,
  updateTicketPriority,
} = require("../controllers/ticketController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All ticket routes require authentication
router.use(protect);

// Create Ticket
router.post(
  "/",
  authorize("owner", "admin", "agent", "customer"),
  createTicket
);

// Get All Tickets
router.get("/", getTickets);

// Get Single Ticket
router.get("/:id", getTicketById);

// Update Ticket
router.patch(
  "/:id",
  authorize("owner", "admin", "agent"),
  updateTicket
);

// Delete Ticket
router.delete(
  "/:id",
  authorize("owner"),
  deleteTicket
);

//Update Ticket Status
router.patch(
  "/:id/status",
  authorize("owner", "admin", "agent"),
  updateTicketStatus
);

//Update Ticket Priority
router.patch(
  "/:id/priority",
  authorize("owner", "admin"),
  updateTicketPriority
);


//assign ticket
router.patch(
  "/:id/assign",
  authorize("owner", "admin"),
  assignTicket
);

module.exports = router;
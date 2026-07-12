const express = require("express");

const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All ticket routes require authentication
router.use(protect);

// Create Ticket
router.post("/", createTicket);

// Get All Tickets
router.get("/", getTickets);

// Get Single Ticket
router.get("/:id", getTicketById);

// Update Ticket
router.patch("/:id", updateTicket);

// Delete Ticket
router.delete("/:id", deleteTicket);

module.exports = router;
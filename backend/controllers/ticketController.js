const Ticket = require("../models/Ticket");

// ======================================
// Create Ticket
// POST /api/tickets
// ======================================

const createTicket = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      category,
      assignedTo,
      tags,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Title and description are required.",
      });
    }

    const ticket = await Ticket.create({
      title: title.trim(),
      description: description.trim(),

      priority:
        priority || "medium",

      category:
        category || "support",

      assignedTo:
        assignedTo || null,

      tags:
        Array.isArray(tags)
          ? tags
          : [],

      createdBy: req.user._id,
    });

    await ticket.populate(
      "createdBy",
      "name email"
    );

    await ticket.populate(
      "assignedTo",
      "name email"
    );

    return res.status(201).json({
      success: true,
      message:
        "Ticket created successfully.",
      ticket,
    });
  } catch (error) {
    console.error(
      "Create Ticket Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create ticket.",
    });
  }
};

// ======================================
// Get All Tickets
// GET /api/tickets
// ======================================

const getTickets = async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      category,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (
      priority &&
      priority !== "all"
    ) {
      query.priority = priority;
    }

    if (
      category &&
      category !== "all"
    ) {
      query.category = category;
    }

    const tickets = await Ticket.find(query)
      .populate(
        "createdBy",
        "name email"
      )
      .populate(
        "assignedTo",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch tickets.",
    });
  }
};

// ======================================
// Get Single Ticket
// GET /api/tickets/:id
// ======================================

const getTicketById = async (
  req,
  res
) => {
  try {
    const ticket =
      await Ticket.findById(
        req.params.id
      )
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "assignedTo",
          "name email"
        );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message:
          "Ticket not found.",
      });
    }

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error(
      "Get Ticket Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch ticket.",
    });
  }
};

// ======================================
// Update Ticket
// PATCH /api/tickets/:id
// ======================================

const updateTicket = async (
  req,
  res
) => {
  try {
    const ticket =
      await Ticket.findById(
        req.params.id
      );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message:
          "Ticket not found.",
      });
    }

    Object.assign(ticket, req.body);

    await ticket.save();

    await ticket.populate(
      "createdBy",
      "name email"
    );

    await ticket.populate(
      "assignedTo",
      "name email"
    );

    return res.status(200).json({
      success: true,
      message:
        "Ticket updated successfully.",
      ticket,
    });
  } catch (error) {
    console.error(
      "Update Ticket Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update ticket.",
    });
  }
};

// ======================================
// Delete Ticket
// DELETE /api/tickets/:id
// ======================================

const deleteTicket = async (
  req,
  res
) => {
  try {
    const ticket =
      await Ticket.findById(
        req.params.id
      );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message:
          "Ticket not found.",
      });
    }

    await ticket.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Ticket deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Ticket Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete ticket.",
    });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};
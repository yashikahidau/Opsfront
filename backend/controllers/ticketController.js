const Ticket = require("../models/Ticket");
const logActivity = require("../utils/logActivity");

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

    const slaHours =
  (priority || "medium") === "critical"
    ? 4
    : (priority || "medium") === "high"
    ? 8
    : (priority || "medium") === "medium"
    ? 24
    : 48;

const slaDueAt = new Date(
  Date.now() + slaHours * 60 * 60 * 1000
);

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

slaDueAt,

slaStatus: "healthy",
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
      page = 1,
      limit = 10,
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
        {
          priority: {
            $regex: search,
            $options: "i",
          },
        },
        {
          status: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
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

    const currentPage = Number(page);
    const pageLimit = Number(limit);

    const totalTickets =
      await Ticket.countDocuments(query);

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
      })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit);

    return res.json({
      success: true,
      tickets,

      pagination: {
        page: currentPage,
        limit: pageLimit,
        totalTickets,
        totalPages: Math.ceil(
          totalTickets / pageLimit
        ),
      },
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
// Update Ticket Status
// ======================================

const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = [
      "open",
      "in-progress",
      "waiting",
      "resolved",
      "closed",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Save previous status
    const previousStatus = ticket.status;

    // Update status
    ticket.status = status;

    await ticket.save();

    await ticket.populate("createdBy", "name email");
    await ticket.populate("assignedTo", "name email");

    // Log activity
    await logActivity({
      ticket: ticket._id,
      user: req.user._id,
      type: "status",
      message: `Changed status from "${previousStatus}" to "${status}"`,
    });

    res.json({
      success: true,
      ticket,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to update ticket.",
    });
  }
};

// ======================================
// Update Ticket Priority
// ======================================
const updateTicketPriority = async (req, res) => {
  try {
    const { priority } = req.body;

    const allowed = [
      "low",
      "medium",
      "high",
      "critical",
    ];

    if (!allowed.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    const previousPriority = ticket.priority;

    ticket.priority = priority;

    await ticket.save();

    await ticket.populate(
      "createdBy",
      "name email"
    );

    await ticket.populate(
      "assignedTo",
      "name email"
    );

    await logActivity({
      ticket: ticket._id,
      user: req.user._id,
      type: "priority",
      message: `Changed priority from "${previousPriority}" to "${priority}"`,
    });

    res.json({
      success: true,
      ticket,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to update priority.",
    });
  }
};

// ======================================
// Assign Ticket
// ======================================

const assignTicket = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    const previousAssignee = ticket.assignedTo;

    ticket.assignedTo = assignedTo || null;

    await ticket.save();

    await ticket.populate("createdBy", "name email");
    await ticket.populate("assignedTo", "name email");

    await logActivity({
      ticket: ticket._id,
      user: req.user._id,
      type: "assigned",
      message: ticket.assignedTo
        ? `Assigned ticket to ${ticket.assignedTo.name}`
        : "Removed ticket assignment",
    });

    res.json({
      success: true,
      ticket,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to assign ticket.",
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
  updateTicketStatus,
  updateTicketPriority,
  assignTicket,
  updateTicket,
  deleteTicket,
};
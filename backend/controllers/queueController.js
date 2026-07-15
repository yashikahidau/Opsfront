const Ticket = require("../models/Ticket");

const getQueue = async (req, res) => {
  try {
    const {
  search = "",
  priority,
  status,
  assignee,
  category,
} = req.query;

    const query = {};

    if (priority) {
      query.priority = priority;
    }

    if (status) {
      query.status = status;
    }

    if (assignee) {
      query.assignedTo = assignee;
    }

    if (category) {
  query.category = category;
}

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

    const tickets = await Ticket.find(query)
      .populate(
        "assignedTo",
        "name email"
      )
      .populate(
        "createdBy",
        "name"
      )
     const { sort = "newest" } = req.query;

let sortQuery = {
  createdAt: -1,
};

switch (sort) {
  case "oldest":
    sortQuery = {
      createdAt: 1,
    };
    break;

  case "priority":
    sortQuery = {
      priority: 1,
      createdAt: -1,
    };
    break;

  case "status":
    sortQuery = {
      status: 1,
      createdAt: -1,
    };
    break;
}

    const stats = {
      total: tickets.length,

      open: tickets.filter(
        (t) => t.status === "open"
      ).length,

      inProgress: tickets.filter(
        (t) => t.status === "in-progress"
      ).length,

      waiting: tickets.filter(
        (t) => t.status === "waiting"
      ).length,

      resolved: tickets.filter(
        (t) => t.status === "resolved"
      ).length,

      high: tickets.filter(
        (t) =>
          t.priority === "high"
      ).length,

      critical: tickets.filter(
        (t) =>
          t.priority === "critical"
      ).length,

      unassigned: tickets.filter(
        (t) => !t.assignedTo
      ).length,
    };

    res.json({
      success: true,
      stats,
      tickets,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message:
        "Unable to load queue.",
    });
  }
};

module.exports = {
  getQueue,
};
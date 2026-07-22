const Ticket = require("../models/Ticket");

// ======================================
// GET /api/dashboard
// Dashboard Overview
// ======================================

const getDashboardOverview = async (req, res) => {
  try {

    const ticketFilter =
      req.user.userType === "customer"
        ? { createdBy: req.user.id }
        : req.user.role === "agent"
          ? { assignedTo: req.user.id }
          : {};

    const [
      totalTickets,
      openTickets,
      inProgressTickets,
      waitingTickets,
      resolvedTickets,
      criticalTickets,
      highRiskTickets,
    ] = await Promise.all([

      Ticket.countDocuments(ticketFilter),

      Ticket.countDocuments({
        ...ticketFilter,
        status: "open",
      }),

      Ticket.countDocuments({
        ...ticketFilter,
        status: "in-progress",
      }),

      Ticket.countDocuments({
        ...ticketFilter,
        status: "waiting",
      }),

      Ticket.countDocuments({
        ...ticketFilter,
        status: "resolved",
      }),

      Ticket.countDocuments({
        ...ticketFilter,
        priority: "critical",
      }),

      Ticket.countDocuments({
        ...ticketFilter,
        riskScore: {
          $gte: 70,
        },
      }),
    ]);

    const latestTickets = await Ticket.find(
      ticketFilter
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    const slaCompliance =
      totalTickets === 0
        ? 100
        : Math.round(
          (resolvedTickets / totalTickets) *
          100
        );

    return res.status(200).json({
      success: true,

      overview: {
        totalTickets,

        openTickets,

        inProgressTickets,

        waitingTickets,

        resolvedTickets,

        criticalTickets,

        highRiskTickets,

        slaCompliance,

        latestTickets,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load dashboard.",
    });
  }
};

module.exports = {
  getDashboardOverview,
};
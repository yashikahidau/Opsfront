const Ticket = require("../models/Ticket");

// ======================================
// GET /api/dashboard
// Dashboard Overview
// ======================================

const getDashboardOverview = async (req, res) => {
  try {
    const [
      totalTickets,
      openTickets,
      inProgressTickets,
      waitingTickets,
      resolvedTickets,
      criticalTickets,
      highRiskTickets,
    ] = await Promise.all([
      Ticket.countDocuments(),

      Ticket.countDocuments({
        status: "open",
      }),

      Ticket.countDocuments({
        status: "in-progress",
      }),

      Ticket.countDocuments({
        status: "waiting",
      }),

      Ticket.countDocuments({
        status: "resolved",
      }),

      Ticket.countDocuments({
        priority: "critical",
      }),

      Ticket.countDocuments({
        riskScore: {
          $gte: 70,
        },
      }),
    ]);

    const latestTickets = await Ticket.find()
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
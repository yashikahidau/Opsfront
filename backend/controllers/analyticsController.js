const Ticket = require("../models/Ticket");
const User = require("../models/User");
const calculateSlaStatus = require("../utils/calculateSlaStatus");

const getAnalytics = async (req, res) => {
  try {
    const days = Number(req.query.days || 30);

    const fromDate = new Date();

    fromDate.setHours(0, 0, 0, 0);

    fromDate.setDate(
      fromDate.getDate() - (days - 1)
    );

    let tickets = await Ticket.find({
  createdAt: {
    $gte: fromDate,
  },
})
  .populate("assignedTo", "name")
  .populate("createdBy", "name");

tickets = tickets.map((ticket) => ({
  ...ticket.toObject(),
  slaStatus: calculateSlaStatus(ticket),
}));

    const agents = await User.find({
      role: "agent",
    });

    const stats = {
      total: tickets.length,

      open: tickets.filter(
        (t) => t.status === "open"
      ).length,

      waiting: tickets.filter(
        (t) => t.status === "waiting"
      ).length,

      resolved: tickets.filter(
        (t) => t.status === "resolved"
      ).length,

      critical: tickets.filter(
        (t) => t.priority === "critical"
      ).length,

      slaCompliance:
        tickets.length === 0
          ? 100
          : Math.round(
            (tickets.filter(
              (t) =>
                t.slaStatus !== "breached"
            ).length /
              tickets.length) *
            100
          ),

      escalationRate:
        tickets.length === 0
          ? 0
          : Number(
            (
              (tickets.filter(
                (t) =>
                  t.priority === "critical"
              ).length /
                tickets.length) *
              100
            ).toFixed(1)
          ),

      medianResolution:
        "3h 42m",
    };

    const categoryMap = {};

    tickets.forEach((ticket) => {
      categoryMap[ticket.category] =
        (categoryMap[ticket.category] || 0) + 1;
    });

    const colors = {
      bug: "bg-destructive",
      feature: "bg-primary",
      billing: "bg-sky-500",
      support: "bg-emerald-500",
      other: "bg-muted-foreground",
    };

    const queueBreakdown =
      Object.entries(categoryMap).map(
        ([label, value]) => ({
          label,
          value,
          tone:
            colors[label] ||
            "bg-primary",
        })
      );

    const riskTrend = [];

    for (let i = 6; i >= 0; i--) {
      const start = new Date();

      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - i);

      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const count = tickets.filter((ticket) => {
        return (
          ticket.createdAt >= start &&
          ticket.createdAt < end
        );
      }).length;

      riskTrend.push({
        day: start.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        value: count,
      });
    }

    const agentLoad = agents.map(
      (agent) => {
        const assigned =
          tickets.filter(
            (t) =>
              t.assignedTo?._id?.toString() ===
              agent._id.toString()
          );

        return {
          name: agent.name,

          open: assigned.filter(
            (t) =>
              t.status !== "resolved"
          ).length,

          risk: assigned.filter(
            (t) =>
              t.priority === "critical"
          ).length,

          resolved:
            assigned.filter(
              (t) =>
                t.status === "resolved"
            ).length,
        };
      }
    );

    const slaPolicies = [
      {
        name: "Critical",
        response: "15m",
        resolution: "2h",
        compliance: "91%",
      },
      {
        name: "High",
        response: "1h",
        resolution: "8h",
        compliance: "96%",
      },
      {
        name: "Medium",
        response: "4h",
        resolution: "24h",
        compliance: "98%",
      },
      {
        name: "Low",
        response: "8h",
        resolution: "48h",
        compliance: "99%",
      },
    ];

    const insights = [];

    if (stats.critical > 0) {
      insights.push(
        "Critical tickets require immediate attention."
      );
    }

    if (
      stats.waiting >
      stats.open / 2
    ) {
      insights.push(
        "Many tickets are waiting for customer response."
      );
    }

    if (
      stats.open >
      stats.resolved
    ) {
      insights.push(
        "Open ticket volume is growing faster than resolution."
      );
    }

    if (insights.length === 0) {
      insights.push(
        "Operations are healthy."
      );
    }

    res.json({
      success: true,
      stats,
      queueBreakdown,
      riskTrend,
      agentLoad,
      slaPolicies,
      insights,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message:
        "Unable to load analytics.",
    });
  }
};

const exportAnalytics = async (
  req,
  res
) => {
  try {
    const tickets =
      await Ticket.find();

    let csv =
      "Title,Priority,Status,Category,Created At\n";

    tickets.forEach((ticket) => {
      csv += `"${ticket.title}","${ticket.priority}","${ticket.status}","${ticket.category}","${ticket.createdAt.toISOString()}"\n`;
    });

    res.setHeader(
      "Content-Type",
      "text/csv"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=analytics-report.csv"
    );

    res.send(csv);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message:
        "Unable to export analytics.",
    });
  }
};

module.exports = {
  getAnalytics,
  exportAnalytics,
};
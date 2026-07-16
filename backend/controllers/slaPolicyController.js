const Ticket = require("../models/Ticket");
const SlaPolicy = require("../models/SlaPolicy");
const calculateSlaStatus = require("../utils/calculateSlaStatus");

exports.getSlaDashboard = async (req, res) => {
  try {
    let tickets = await Ticket.find();

    tickets = tickets.map((ticket) => ({
      ...ticket.toObject(),
      slaStatus: calculateSlaStatus(ticket),
    }));

    let policies = await SlaPolicy.find().sort({
      priority: 1,
    });

    if (policies.length === 0) {
      await SlaPolicy.insertMany([
        {
          name: "P1 Critical",
          priority: "critical",
          response: "15m",
          resolution: "2h",
          escalation: "70%",
          compliance: 91,
        },
        {
          name: "P2 High",
          priority: "high",
          response: "1h",
          resolution: "8h",
          escalation: "75%",
          compliance: 96,
        },
        {
          name: "P3 Medium",
          priority: "medium",
          response: "4h",
          resolution: "24h",
          escalation: "85%",
          compliance: 98,
        },
        {
          name: "P4 Low",
          priority: "low",
          response: "8h",
          resolution: "48h",
          escalation: "90%",
          compliance: 99,
        },
      ]);

      policies = await SlaPolicy.find().sort({
        priority: 1,
      });
    }

    for (const policy of policies) {
  switch (policy.priority) {
    case "critical":
      policy.compliance = 91;
      break;

    case "high":
      policy.compliance = 96;
      break;

    case "medium":
      policy.compliance = 98;
      break;

    case "low":
      policy.compliance = 99;
      break;
  }

  await policy.save();
}

    policies = policies.map((policy) => ({
      _id: policy._id.toString(),
      name: policy.name,
      priority: policy.priority,
      response: policy.response,
      resolution: policy.resolution,
      escalation: policy.escalation,
      compliance: policy.compliance,
      status: policy.status,
    }));


    const health = {
      breachedToday: tickets.filter(
        t => t.slaStatus === "breached"
      ).length,

      atRisk: tickets.filter(
        t => t.slaStatus === "warning"
      ).length,

      avgFirstResponse: "42m",
    };

    const recommendations = [];

    if (health.breachedToday > 0) {
      recommendations.push(
        "Review breached SLA tickets immediately."
      );
    }

    if (health.atRisk > 5) {
      recommendations.push(
        "Several tickets are approaching SLA breach."
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "SLA health looks good."
      );
    }

    res.json({
      success: true,
      policies,
      health,
      recommendations,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.exportPolicies = async (req, res) => {
  try {
    const policies = [
      {
        name: "P1 Critical",
        priority: "critical",
        response: "15m",
        resolution: "2h",
        escalation: "70%",
      },
      {
        name: "P2 High",
        priority: "high",
        response: "1h",
        resolution: "8h",
        escalation: "75%",
      },
      {
        name: "P3 Medium",
        priority: "medium",
        response: "4h",
        resolution: "24h",
        escalation: "85%",
      },
      {
        name: "P4 Low",
        priority: "low",
        response: "8h",
        resolution: "48h",
        escalation: "90%",
      },
    ];

    const rows = [
      [
        "Policy",
        "Priority",
        "Response",
        "Resolution",
        "Escalation",
      ].join(","),
    ];

    policies.forEach((p) => {
      rows.push(
        [
          p.name,
          p.priority,
          p.response,
          p.resolution,
          p.escalation,
        ].join(",")
      );
    });

    res.setHeader(
      "Content-Type",
      "text/csv"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="sla-policies.csv"'
    );

    res.send(rows.join("\n"));
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      response,
      resolution,
      escalation,
      status,
    } = req.body;

    const policy =
      await SlaPolicy.findById(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found.",
      });
    }

    if (response) {
      policy.response = response;
    }

    if (resolution) {
      policy.resolution = resolution;
    }

    if (escalation) {
      policy.escalation = escalation;
    }

    if (status) {
      policy.status = status;
    }

    await policy.save();

    res.json({
      success: true,
      message: "Policy updated successfully.",
      policy,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
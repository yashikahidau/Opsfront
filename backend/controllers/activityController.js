const Activity = require("../models/Activity");

const Ticket = require("../models/Ticket");

const getActivities = async (req, res) => {
  try {
    const ticket = await Ticket.findById(
      req.params.ticketId
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    const activities =
      await Activity.find({
        ticket: req.params.ticketId,
      })
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      activities,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch activities.",
    });
  }
};

module.exports = {
  getActivities,
};
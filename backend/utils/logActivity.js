const Activity = require("../models/Activity");

async function logActivity({
  ticket,
  user,
  type,
  message,
}) {
  try {
    await Activity.create({
      ticket,
      user,
      type,
      message,
    });
  } catch (err) {
    console.error(
      "Activity log failed:",
      err
    );
  }
}

module.exports = logActivity;
const Notification = require("../models/Notification");

const createNotification = async ({
  recipient,
  recipientType,
  title,
  message,
  type,
  entityType = "system",
  entityId = null,
}) => {
  try {
    return await Notification.create({
      recipient,
      recipientType,
      title,
      message,
      type,
      entityType,
      entityId,
    });
  } catch (error) {
    console.error("Notification Error:", error.message);
    return null;
  }
};

module.exports = createNotification;
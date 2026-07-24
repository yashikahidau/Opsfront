const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recipientType: {
      type: String,
      enum: ["customer", "internal"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "ticket_created",
        "ticket_assigned",
        "ticket_updated",
        "ticket_status_changed",
        "ticket_closed",
        "ticket_reopened",
        "comment_added",
        "sla_warning",
        "user_registered",
        "system",
      ],
      required: true,
    },

    entityType: {
      type: String,
      enum: ["ticket", "comment", "user", "system"],
      default: "system",
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    status: {
      type: String,
      enum: [
        "open",
        "in-progress",
        "waiting",
        "resolved",
        "closed",
      ],
      default: "open",
    },

    priority: {
      type: String,
      enum: [
        "low",
        "medium",
        "high",
        "critical",
      ],
      default: "medium",
    },

    category: {
      type: String,
      enum: [
        "bug",
        "feature",
        "billing",
        "support",
        "other",
      ],
      default: "support",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    slaDueAt: {
      type: Date,
    },

    slaStatus: {
      type: String,
      enum: ["healthy", "warning", "breached"],
      default: "healthy",
    },

    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Ticket ||
  mongoose.model(
    "Ticket",
    ticketSchema
  );
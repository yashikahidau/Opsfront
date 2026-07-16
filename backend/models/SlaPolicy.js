const mongoose = require("mongoose");

const slaPolicySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: [
        "critical",
        "high",
        "medium",
        "low",
      ],
      required: true,
      unique: true,
    },

    response: {
      type: String,
      required: true,
    },

    resolution: {
      type: String,
      required: true,
    },

    escalation: {
      type: String,
      required: true,
    },

    compliance: {
      type: Number,
      default: 100,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.SlaPolicy ||
  mongoose.model(
    "SlaPolicy",
    slaPolicySchema
  );
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    workspaceName: {
      type: String,
      default: "Opsfront",
    },

    supportEmail: {
      type: String,
      default: "support@opsfront.app",
    },

    primaryTeam: {
      type: String,
      default: "Internal IT Operations",
    },

    timezone: {
      type: String,
      default: "UTC +05:30",
    },

    notifications: {
      escalationAlerts: {
        type: Boolean,
        default: true,
      },

      leadAlerts: {
        type: Boolean,
        default: true,
      },

      dailySummary: {
        type: Boolean,
        default: false,
      },

      slackDigest: {
        type: Boolean,
        default: true,
      },
    },

    automation: {
      autoAssign: {
        type: Boolean,
        default: true,
      },

      autoEscalation: {
        type: Boolean,
        default: true,
      },

      queueFallback: {
        type: String,
        default: "Ops triage",
      },

      riskInterval: {
        type: String,
        default: "Every 10 min",
      },
    },

    security: {
      twoFactor: {
        type: Boolean,
        default: true,
      },

      googleLogin: {
        type: Boolean,
        default: true,
      },

      sessionTimeout: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Settings",
  settingsSchema
);
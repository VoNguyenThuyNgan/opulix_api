// models/AuditLog.js
const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  username: String,

  action: {
    type: String, // CREATE_RULE, UPDATE_RULE, DELETE_RULE
    required: true,
  },

  entity: {
    type: String, // PricingRule
    required: true,
  },

  entityId: mongoose.Schema.Types.ObjectId,

  oldValue: Object,
  newValue: Object,

  source: {
    type: String,
    enum: ["MANUAL", "AUTO"],
    default: "MANUAL",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);

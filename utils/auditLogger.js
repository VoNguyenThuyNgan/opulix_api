// utils/auditLogger.js
const AuditLog = require("../models/AuditLog");

const logAudit = async ({
  user,
  action,
  entity,
  entityId,
  oldValue,
  newValue,
  source = "MANUAL",
}) => {
  try {
    await AuditLog.create({
      userId: user?._id,
      username: user?.username || "system",
      action,
      entity,
      entityId,
      oldValue,
      newValue,
      source,
    });
  } catch (err) {
    console.error("Audit log error:", err.message);
  }
};

module.exports = logAudit;

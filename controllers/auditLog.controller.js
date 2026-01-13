// controllers/auditLog.controller.js
const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res) => {
  const { entity, action } = req.query;

  const filter = {};
  if (entity) filter.entity = entity;
  if (action) filter.action = action;

  const logs = await AuditLog.find(filter)
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(logs);
};

module.exports = { getAuditLogs };

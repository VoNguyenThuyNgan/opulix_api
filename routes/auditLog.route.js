// routes/auditLog.route.js
const router = require("express").Router();
const { getAuditLogs } = require("../controllers/auditLog.controller");

router.get("/", getAuditLogs);

module.exports = router;

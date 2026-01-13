const router = require("express").Router();
const { getRoomPricing } = require("../controllers/pricing.controller");

router.get("/room/:id", getRoomPricing);

module.exports = router;

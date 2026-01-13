const router = require("express").Router();
const {
  getAllRules,
  updateRule,
  createPricingRule,
  deletePricingRule,
} = require("../controllers/pricingRule.controller");

router.get("/", getAllRules);
router.put("/:id", updateRule);
router.post("/", createPricingRule);
router.delete("/:id", deletePricingRule);

module.exports = router;

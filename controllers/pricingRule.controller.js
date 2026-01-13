const PricingRule = require("../models/PricingRule");
const logAudit = require("../utils/auditLogger");

const getAllRules = async (req, res) => {
  const rules = await PricingRule.find();
  res.json(rules);
};

// controllers/pricingRule.controller.js

const createPricingRule = async (req, res) => {
  try {
    const { key, name, percentage, conditionConfig } = req.body;

    // 1. check required
    if (!key || percentage === undefined) {
      return res.status(400).json({
        message: "Key and percentage are required",
      });
    }

    // 2. check duplicate key
    const existed = await PricingRule.findOne({ key });
    if (existed) {
      return res.status(400).json({
        message: "Pricing rule key already exists",
      });
    }

    // 3. validate conditionConfig theo key
    if (key === "HIGH_OCCUPANCY" && conditionConfig?.occupancyFrom == null) {
      return res.status(400).json({
        message: "HIGH_OCCUPANCY requires occupancyFrom",
      });
    }

    if (key === "LOW_OCCUPANCY" && conditionConfig?.occupancyTo == null) {
      return res.status(400).json({
        message: "LOW_OCCUPANCY requires occupancyTo",
      });
    }

    if (key === "NEAR_CHECKIN" && conditionConfig?.daysToCheckIn == null) {
      return res.status(400).json({
        message: "NEAR_CHECKIN requires daysToCheckIn",
      });
    }

    // WEEKEND → không cần conditionConfig

    const rule = await PricingRule.create({
      key,
      name,
      percentage,
      conditionConfig,
    });

    // 🔥 AUDIT LOG
    await logAudit({
      user: req.user, // nếu chưa có auth thì cho fake user cũng OK
      action: "CREATE_RULE",
      entity: "PricingRule",
      entityId: rule._id,
      newValue: rule,
    });

    res.status(201).json(rule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRule = async (req, res) => {
  try {
    const { name, isActive, percentage, conditionConfig } = req.body;

    // 1. lấy bản cũ để audit
    const oldRule = await PricingRule.findById(req.params.id);
    if (!oldRule) {
      return res.status(404).json({ message: "Pricing rule not found" });
    }

    // 2. update
    const updatedRule = await PricingRule.findByIdAndUpdate(
      req.params.id,
      { name, isActive, percentage, conditionConfig },
      { new: true }
    );

    // 3. audit log
    await logAudit({
      user: req.user || { id: "system" }, // chưa có auth thì fake
      action: "UPDATE_RULE",
      entity: "PricingRule",
      entityId: updatedRule._id,
      oldValue: oldRule,
      newValue: updatedRule,
    });

    res.json(updatedRule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const deletePricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({
        message: "Pricing rule not found",
      });
    }

    // ❌ không cho xóa rule core
    const protectedKeys = [
      "HIGH_OCCUPANCY",
      "LOW_OCCUPANCY",
      "NEAR_CHECKIN",
      "WEEKEND",
    ];

    if (protectedKeys.includes(rule.key)) {
      return res.status(400).json({
        message: "System pricing rule cannot be deleted",
      });
    }

    await rule.deleteOne();

    // 🔥 AUDIT LOG
    await logAudit({
      user: req.user,
      action: "DELETE_RULE",
      entity: "PricingRule",
      entityId: rule._id,
      oldValue: rule,
    });

    res.json({
      message: "Pricing rule deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllRules,
  updateRule,
  createPricingRule,
  deletePricingRule,
};



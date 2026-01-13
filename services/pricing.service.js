const PricingRule = require("../models/PricingRule");

const calculateDynamicPrice = async ({ basePrice, context }) => {
  let finalPrice = basePrice;
  const appliedRules = [];

  const rules = await PricingRule.find({ isActive: true });

  for (const rule of rules) {
    let isApply = false;

    switch (rule.key) {
      case "HIGH_OCCUPANCY":
        isApply =
          context.occupancyRate >= rule.conditionConfig.occupancyFrom;
        break;

      case "LOW_OCCUPANCY":
        isApply =
          context.occupancyRate <= rule.conditionConfig.occupancyTo;
        break;

      case "NEAR_CHECKIN":
        isApply =
          context.daysToCheckIn <= rule.conditionConfig.daysToCheckIn;
        break;

      case "WEEKEND":
        isApply = context.isWeekend;
        break;
    }

    if (isApply) {
      finalPrice = finalPrice * (1 + rule.percentage / 100);
      appliedRules.push(`${rule.name} (${rule.percentage}%)`);
    }
  }

  return {
    basePrice,
    finalPrice: Math.round(finalPrice),
    appliedRules,
  };
};

module.exports = {
  calculateDynamicPrice,
};

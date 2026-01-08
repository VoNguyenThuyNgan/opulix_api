const PricingRule = require("../models/PricingRule");
const { calculateRoomOccupancy } = require("./occupancy.service");

/**
 * Kiểm tra rule có match hay không
 */
const isRuleMatched = (rule, context) => {
  const { occupancy, bookingDate } = context;

  switch (rule.ruleType) {
    case "OCCUPANCY":
      return (
        occupancy >= rule.condition.occupancyFrom &&
        occupancy <= rule.condition.occupancyTo
      );

    case "WEEKDAY":
      return rule.condition.daysOfWeek.includes(
        bookingDate.getDay()
      );

    default:
      return false;
  }
};

/**
 * Áp rule vào giá hiện tại
 */
const applyRule = (currentPrice, rule) => {
  if (rule.adjustmentType === "PERCENT") {
    return currentPrice + (currentPrice * rule.adjustmentValue) / 100;
  }
  return currentPrice;
};

/**
 * Pricing Engine chính
 */
const calculateDynamicPrice = async ({
  room,
  bookingDate,
}) => {
  // Tính occupancy thật từ transaction
  const occupancy = await calculateRoomOccupancy({
    roomId: room._id,
    targetDate: bookingDate,
  });

  // Lấy rule đang active, sort theo priority
  const rules = await PricingRule.find({ isActive: true }).sort({
    priority: 1,
  });

  let finalPrice = room.price;
  const appliedRules = [];

  for (const rule of rules) {
    if (isRuleMatched(rule, { occupancy, bookingDate })) {
      finalPrice = applyRule(finalPrice, rule);
      appliedRules.push({
        ruleId: rule._id,
        ruleName: rule.name,
      });
    }
  }

  return {
    basePrice: room.price,
    finalPrice: Math.round(finalPrice),
    occupancy,
    appliedRules,
  };
};

module.exports = { calculateDynamicPrice };

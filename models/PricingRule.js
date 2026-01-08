const mongoose = require("mongoose");

/**
 * Pricing Rule dùng cho Dynamic Pricing
 * Ví dụ:
 * - Occupancy >= 80% => +20%
 * - Weekend => +15%
 */
const PricingRuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    ruleType: {
      type: String,
      enum: ["OCCUPANCY", "WEEKDAY"],
      required: true,
    },

    /**
     * Điều kiện áp rule
     * OCCUPANCY: occupancyFrom -> occupancyTo (0 - 1)
     * WEEKDAY: daysOfWeek [0..6]
     */
    condition: {
      occupancyFrom: Number,
      occupancyTo: Number,
      daysOfWeek: [Number],
    },

    /**
     * Hiện tại chỉ làm PERCENT cho dễ test
     * Ví dụ: +20 (%) hoặc -10 (%)
     */
    adjustmentType: {
      type: String,
      enum: ["PERCENT"],
      default: "PERCENT",
    },

    adjustmentValue: {
      type: Number,
      required: true,
    },

    /**
     * Rule chạy theo thứ tự priority (số nhỏ chạy trước)
     */
    priority: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PricingRule", PricingRuleSchema);

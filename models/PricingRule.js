const mongoose = require("mongoose");

const PricingRuleSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "HIGH_OCCUPANCY",
        "LOW_OCCUPANCY",
        "NEAR_CHECKIN",
        "WEEKEND",
        "CUSTOM"
      ],
    },

    name: String,

    isActive: {
      type: Boolean,
      default: true,
    },

    percentage: {
      type: Number, // ví dụ: 20 = +20%, -10 = -10%
      required: true,
    },

    conditionConfig: {
      occupancyFrom: Number,
      occupancyTo: Number,
      daysToCheckIn: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PricingRule", PricingRuleSchema);

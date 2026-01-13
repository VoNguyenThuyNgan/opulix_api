const cron = require("node-cron");
const Room = require("../models/Room");
const { calculateOccupancyRate } = require("../services/occupancy.service");
const { calculateDynamicPrice } = require("../services/pricing.service");

const startDynamicPricingCron = () => {
  cron.schedule("*/30 * * * * *", async () => {
    console.log("⏰ Dynamic Pricing Cron started");

    const rooms = await Room.find();

    for (const room of rooms) {
      const now = new Date();

      const occupancyRate = await calculateOccupancyRate({
        roomId: room._id,
        date: now,
      });

      const context = {
        occupancyRate,
        daysToCheckIn: 1, // giả lập
        isWeekend: [0, 6].includes(now.getDay()),
        totalRooms: room.roomNumbers.length,
      };

      const pricingResult = calculateDynamicPrice({
        basePrice: room.price,
        context,
      });

      room.dynamicPrice = pricingResult.finalPrice;
      room.dynamicPricingMeta = {
        occupancyRate,
        appliedRules: pricingResult.appliedRules,
        calculatedAt: new Date(),
      };
      await room.save();

      console.log(
        `🏨 Room ${room.title} | Occupancy ${(occupancyRate * 100).toFixed(
          0
        )}% | ${room.price} → ${room.dynamicPrice}`,
        pricingResult.appliedRules
      );
    }
  });
};

module.exports = startDynamicPricingCron;

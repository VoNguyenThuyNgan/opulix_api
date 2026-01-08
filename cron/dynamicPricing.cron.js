const cron = require("node-cron");
const Room = require("../models/Room");
const Transaction = require("../models/Transaction");
const { calculateDynamicPrice } = require("../services/pricing.service");

const startDynamicPricingCron = () => {
  cron.schedule("*/30 * * * * *", async () => {
    console.log("⏰ Cron Dynamic Pricing chạy:", new Date().toISOString());

    const rooms = await Room.find();

    for (const room of rooms) {
      const total = room.roomNumbers.length;

      const bookedRoomIds = new Set();

      transactions.forEach((tr) => {
        tr.room.forEach((r) => {
          if (r.roomId.toString() === room._id.toString()) {
            bookedRoomIds.add(r._id.toString()); // hoặc r.roomId.toString() tuỳ cách định nghĩa
          }
        });
      });

      const bookedRooms = bookedRoomIds.size;
      const occupancy = total === 0 ? 0 : bookedRooms / total;

      const transactions = await Transaction.find({
        "room.roomId": room._id,
        status: { $in: ["Booked", "Checkin"] },
      });

      // let bookedRooms = 0;

      // transactions.forEach((tr) => {
      //   tr.room.forEach((r) => {
      //     if (r.roomId.toString() === room._id.toString()) {
      //       bookedRooms += 1;
      //     }
      //   });
      // });

      // const occupancy = total === 0 ? 0 : bookedRooms / total;

      const newDynamicPrice = calculateDynamicPrice({
        basePrice: room.price,
        occupancy,
        daysToCheckin: 7, // MVP
      });

      console.log({
        room: room.title,
        basePrice: room.price,
        oldDynamicPrice: room.dynamicPrice,
        newDynamicPrice,
        occupancy,
      });

      // 🔥 chỉ ghi DB khi giá thay đổi
      if (room.dynamicPrice !== newDynamicPrice) {
        await Room.updateOne(
          { _id: room._id },
          {
            dynamicPrice: newDynamicPrice,
            $push: {
              priceHistory: {
                price: newDynamicPrice,
                occupancy,
                calculatedAt: new Date(),
              },
            },
          }
        );
      }
    }
  });
};

module.exports = startDynamicPricingCron;

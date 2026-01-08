const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  title: String,

  price: Number,          // base price
  dynamicPrice: Number,   // current realtime price

  maxPeople: Number,
  desc: String,
  roomNumbers: [{ type: Number }],

  // 🔥 NEW: lịch sử biến động giá
  priceHistory: [
    {
      price: Number,
      occupancy: Number,
      calculatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Room", RoomSchema);

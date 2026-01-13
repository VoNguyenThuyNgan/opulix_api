const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  title: String,
  price: Number, // base price
  dynamicPrice: Number, // giá sau khi tính
  maxPeople: Number,
  desc: String,
  roomNumbers: [{ type: Number }],

  dynamicPricingMeta: {
    occupancyRate: Number,
    appliedRules: [String],
    calculatedAt: Date,
  },

  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
});

module.exports = mongoose.model("Room", RoomSchema);

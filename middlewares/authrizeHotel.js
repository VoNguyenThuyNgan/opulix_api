// middleware/authorizeHotel.js
const User = require("../models/User");

exports.authorizeHotel = async (req, res, next) => {
  // admin chuỗi: full quyền
  if (req.user.role === "admin") return next();

  const targetHotelId = req.params.hotelId || req.body.hotel;

  if (!targetHotelId) {
    return res.status(400).json({
      message: "Hotel is required for this action",
    });
  }

  // 🔥 FIX QUAN TRỌNG: lấy user thật từ DB
  const user = await User.findById(req.user.id);

  if (!user || !user.hotel) {
    return res.status(403).json({
      message: "User is not assigned to any hotel",
    });
  }

  if (user.hotel.toString() !== targetHotelId.toString()) {
    return res.status(403).json({
      message: "Access denied (hotel scope)",
    });
  }

  // attach lại cho downstream
  req.user.hotel = user.hotel.toString();

  next();
};

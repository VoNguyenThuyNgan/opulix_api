const router = require("express").Router();
const Room = require("../models/Room");
const { calculateDynamicPrice } = require("../services/pricingRule.service");

/**
 * API preview giá phòng theo dynamic pricing
 *
 * POST /api/pricing/preview
 * Body:
 * {
 *   "roomId": "...",
 *   "bookingDate": "2026-01-10"
 * }
 */
router.post("/preview", async (req, res) => {
  try {
    const { roomId, bookingDate } = req.body;

    if (!roomId || !bookingDate) {
      return res.status(400).json({
        success: false,
        message: "roomId and bookingDate are required",
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const result = await calculateDynamicPrice({
      room,
      bookingDate: new Date(bookingDate),
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;

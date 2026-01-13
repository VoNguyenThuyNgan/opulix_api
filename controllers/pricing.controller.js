const getRoomPricing = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({
      roomId: room._id,
      basePrice: room.price,
      dynamicPrice: room.dynamicPrice ?? room.price,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getRoomPricing,
};

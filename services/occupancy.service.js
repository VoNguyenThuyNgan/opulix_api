const Transaction = require("../models/Transaction");
const Room = require("../models/Room");

const calculateOccupancyRate = async ({ roomId, date }) => {

  // Lấy room để biết tổng số phòng
  const room = await Room.findById(roomId);
  if (!room) return 0;

  const totalRooms = room.roomNumbers.length;
  if (totalRooms === 0) return 0;

  // Lấy các transaction đang chiếm phòng tại thời điểm đó
  const transactions = await Transaction.find({
    "room.roomId": roomId,
    dateStart: { $lte: date },
    dateEnd: { $gte: date },
    status: { $in: ["Booked", "Checkin"] },
  });

  //Lấy danh sách số phòng đã bị book
  const bookedRoomNumbers = new Set();

  transactions.forEach((trx) => {
    trx.room.forEach((r) => {
      if (r.roomId.toString() === roomId.toString()) {
        bookedRoomNumbers.add(r.number);
      }
    });
  });

  const bookedCount = bookedRoomNumbers.size;

  return bookedCount / totalRooms;
};

module.exports = {
  calculateOccupancyRate,
};

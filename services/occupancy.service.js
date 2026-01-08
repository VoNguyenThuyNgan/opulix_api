const Transaction = require("../models/Transaction");
const Room = require("../models/Room");

/**
 * Tính occupancy của 1 Room tại 1 thời điểm
 *
 * Occupancy = số phòng vật lý đang bị chiếm / tổng phòng vật lý
 *
 * - phòng vật lý = room.roomNumbers[]
 * - phòng đang chiếm = Transaction.room[].number
 * - chỉ tính status Booked, Checkin
 * - chỉ tính booking bị overlap ngày
 */
const calculateRoomOccupancy = async ({ roomId, targetDate }) => {
  // Lấy thông tin room
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Room not found");

  const totalRooms = room.roomNumbers.length;
  if (totalRooms === 0) return 0;

  /**
   * Lấy các transaction:
   * - Có chứa roomId
   * - Status còn hiệu lực
   * - Thời gian overlap
   */
  const transactions = await Transaction.find({
    "room.roomId": roomId,
    status: { $in: ["Booked", "Checkin"] },
    dateStart: { $lt: targetDate },
    dateEnd: { $gt: targetDate },
  });

  /**
   * Dùng Set để tránh đếm trùng phòng vật lý
   */
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

module.exports = { calculateRoomOccupancy };

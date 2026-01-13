// routes/staff.js
const router = require("express").Router();
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

const { authenticate, authorizeRoles } = require("../middlewares/auth");
const { authorizeHotel } = require("../middlewares/authrizeHotel");
const bcrypt = require("bcryptjs");

// GET /api/hotels/:hotelId/staff
// ✅ Manager chỉ thấy staff hotel mình
// ✅ Admin thấy hết
router.get(
  "/hotels/:hotelId",
  authenticate,
  authorizeRoles("admin", "manager"),
  authorizeHotel,
  async (req, res) => {
    const { hotelId } = req.params;

    const staff = await User.find({
      hotel: hotelId,
      role: { $in: ["manager", "staff"] },
    }).select("-password");

    res.json(staff);
  }
);

router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "manager"),
  async (req, res) => {
    const { username, password, role, hotel } = req.body;

    console.log("REQ.USER 👉", req.user);

    // ❌ manager không được tạo admin
    if (req.user.role === "manager" && role === "admin") {
      return res.status(403).json({
        message: "Manager cannot create admin",
      });
    }

    let hotelId = null;

    if (role === "admin") {
      // system admin → không gán hotel
      hotelId = null;
    } else {
      if (req.user.role === "admin") {
        // admin tạo manager / staff
        if (!hotel) {
          return res.status(400).json({
            message: "Hotel is required for staff/manager",
          });
        }
        hotelId = hotel;
      } else {
        // manager tạo staff → auto inherit hotel
        const creator = await User.findById(req.user.id);

        if (!creator?.hotel) {
          return res.status(400).json({
            message: "Manager must belong to a hotel",
          });
        }

        hotelId = creator.hotel;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await User.create({
      username,
      password: hashedPassword,
      role,
      hotel: hotelId,
    });

    await AuditLog.create({
      userId: req.user.id,
      username: req.user.username,
      action: "CREATE_STAFF",
      entity: "User",
      entityId: staff._id,
      newValue: staff.toObject(),
    });

    res.status(201).json(staff);
  }
);


// PATCH /api/staff/:id
router.patch(
  "/:id",
  authenticate,
  authorizeRoles("admin", "manager"),
  async (req, res) => {
    const staff = await User.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (
      req.user.role !== "admin" &&
      staff.hotel?.toString() !== req.user.hotel
    ) {
      return res.status(403).json({
        message: "Access denied (hotel scope)",
      });
    }

    if (req.user.role === "manager" && req.body.hotel) {
      return res.status(403).json({
        message: "Manager cannot change hotel assignment",
      });
    }

    const oldValue = staff.toObject();

    if (req.user.role === "manager" && req.body.role === "admin") {
      return res.status(403).json({
        message: "Manager cannot promote to admin",
      });
    }
    Object.assign(staff, req.body);
    await staff.save();

    await AuditLog.create({
      userId: req.user.id,
      username: req.user.username,
      action: "UPDATE_STAFF",
      entity: "User",
      entityId: staff._id,
      oldValue,
      newValue: staff.toObject(),
    });

    res.json(staff);
  }
);

// DELETE /api/staff/:id
// DELETE /api/staff/:id
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  async (req, res) => {
    const staff = await User.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (staff.role === "admin") {
      return res.status(403).json({
        message: "Cannot delete admin account",
      });
    }

    await staff.deleteOne();

    await AuditLog.create({
      userId: req.user.id,
      username: req.user.username,
      action: "DELETE_STAFF",
      entity: "User",
      entityId: staff._id,
      oldValue: staff.toObject(),
    });

    res.json({ success: true });
  }
);

module.exports = router;

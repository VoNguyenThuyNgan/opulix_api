const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const hotelRoutes = require("./routes/hotel.route");
const transactionRoute = require("./routes/transaction.route");
const uploadRoutes = require("./routes/upload.route");
const pricingRoute = require("./routes/pricing.route");
const pricingRuleRoute = require("./routes/pricingRule.route");
const auditLogRoute = require("./routes/auditLog.route");
const startCronJobs = require("./cron/schedule");
const startDynamicPricingCron = require("./cron/dynamicPricing.cron");
const staffRoutes = require("./routes/staff.route");

const router = express.Router();
const cloudinary = require("./utils/cloudinary");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/rooms", require("./routes/room.route"));
app.use("/api/hotels", hotelRoutes);
app.use("/api/transactions", transactionRoute);
app.use("/api/upload", uploadRoutes);
app.use("/api/pricing", pricingRoute);
app.use("/api/pricing-rules", pricingRuleRoute);
app.use("/api/audit-logs", auditLogRoute);
app.use("/api/staff", staffRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  // startCronJobs();
  // startDynamicPricingCron();
});

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// connect database
connectDB();

const searchRoutes = require("./routes/searchRoutes");
const commentRoutes = require("./routes/commentRoutes");
const activityRoutes = require("./routes/activityRoutes");
const userRoutes = require("./routes/userRoutes");
const queueRoutes = require("./routes/queueRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const slaPolicyRoutes = require("./routes/slaPolicyRoutes");
const settingsRoutes = require("./routes/settings");
const notificationRoutes = require("./routes/notificationRoutes");
// ===== middleware =====
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== health check =====
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Opsfront API is running",
  });
});

// ===== routes =====
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auth", require("./routes/googleAuthRoutes"));
app.use("/api/tickets",require("./routes/ticketRoutes"));
app.use("/api/dashboard",require("./routes/dashboardRoutes"));
app.use("/api/search", searchRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/queue",queueRoutes);
app.use("/api/analytics",analyticsRoutes);
app.use("/api/sla-policies",slaPolicyRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
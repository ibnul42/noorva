// routes/attendance.js
const express = require("express");
const {
  initializeDailyAttendance,
  fetchAttendance,
  updateAttendance,
} = require("../controllers/attendanceController");
const router = express.Router();

// Initialize today's attendance (can be protected/admin-only)
router.post("/init", initializeDailyAttendance);

// Fetch attendance
router.get("/", fetchAttendance);

// Update attendance
router.put("/:id", updateAttendance);

module.exports = router;

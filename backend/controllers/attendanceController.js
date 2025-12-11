// controllers/attendanceController.js
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// Initialize attendance for all employees for today
const initializeDailyAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employees = await Employee.find({});
    for (const emp of employees) {
      const exists = await Attendance.findOne({
        employee: emp._id,
        date: today,
      });

      if (!exists) {
        await Attendance.create({
          employee: emp._id,
          date: today,
          status: "holiday", // default
        });
      }
    }

    res.json({ message: "Daily attendance initialized." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to initialize attendance" });
  }
};

// Fetch attendance
const fetchAttendance = async (req, res) => {
  try {
    const { employeeId, date } = req.query;
    const query = {};

    if (employeeId) query.employee = employeeId;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const attendance = await Attendance.find(query)
      .populate("employee", "fullName employeeId department")
      .sort({ date: -1 });

    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
};

// Update attendance
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updated = await Attendance.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update attendance" });
  }
};

module.exports = {
  initializeDailyAttendance,
  fetchAttendance,
  updateAttendance,
};

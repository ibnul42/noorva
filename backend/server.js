// Load environment variables from .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const cron = require("node-cron");
const port = process.env.PORT || 3001;

// Allow CORS and credentials so that frontend (on another origin) can receive HttpOnly cookies
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
// cookie parser for auth
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mount API routes
const usersRouter = require("./routes/users");
const superUsersRouter = require("./routes/superUsers");
const employeesRouter = require("./routes/employees");
const attendanceRouter = require("./routes/attendance");
const documentRouter = require("./routes/document");
const EmployeeHistoryRouter = require("./routes/employeeHistory");
const EmployeeSalaryRouter = require("./routes/salary");

app.use("/api/users", usersRouter);
app.use("/api/users", superUsersRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/employee-history", EmployeeHistoryRouter);
app.use("/api/documents", documentRouter);
app.use("/api/salary", EmployeeSalaryRouter);

const { connectDB } = require("./helper/db");
const { createMonthlySalaries } = require("./jobs/createMonthlySalaries");

// ----------------------------
// 🕒 CRON JOB INITIALIZATION
// ----------------------------

async function initializeDailyAttendanceCron() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const Employee = require("./models/Employee");
  const Attendance = require("./models/Attendance");

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
        check_in: null, // no check-in yet
        check_out: null, // no check-out yet
        notes: "",
      });
    }
  }
}

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set in environment; aborting");
    process.exit(1);
  }
  try {
    await connectDB(uri);
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
    // ----------------------------
    // 🕒 START CRON AFTER DB CONNECTS
    // ----------------------------
    cron.schedule("* * * * *", async () => {
      console.log("Running daily attendance initialization...");
      try {
        console.log("Testing cron...");
        await initializeDailyAttendanceCron();
        await createMonthlySalaries();
        console.log("Daily attendance initialization completed.");
      } catch (err) {
        console.error("Cron job error:", err);
      }
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

start();

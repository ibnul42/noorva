const router = require("express").Router();
const {
  createHistory,
  getHistoryByEmployee,
  updateHistory,
  deleteHistory,
} = require("../controllers/EmployeeHistoryController");

// Create history
router.post("/", createHistory);

// Get history by employee
router.get("/employee/:employeeId", getHistoryByEmployee);

// Update history
router.put("/:id", updateHistory);

// Delete history (soft delete)
router.delete("/:id", deleteHistory);

module.exports = router;

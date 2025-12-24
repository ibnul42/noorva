const express = require("express");
const {
  createSalary,
  getEmployeeSalaries,
  updateSalaryAdjustments,
  paySalary,
  getAllSalaries,
} = require("../controllers/salaryController.js");
const { requireAuth } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", getAllSalaries);
router.post("/", createSalary);
router.get("/employee/:employeeId", getEmployeeSalaries);
router.patch("/:id/adjustments", updateSalaryAdjustments);
router.post("/:id/pay", paySalary);

module.exports = router;

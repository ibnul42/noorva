const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

// GET all employees
router.get("/", getEmployees);

// GET employee by ID
router.get("/:id", getEmployeeById);

// POST create employee
router.post("/", createEmployee);

// PUT update employee
router.put("/:id", updateEmployee);

// DELETE employee
router.delete("/:id", deleteEmployee);

module.exports = router;

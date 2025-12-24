const Salary = require("../models/Salary");
const Employee = require("../models/Employee");

/**
 * Create salary for an employee (used on employee creation or manual trigger)
 */
const createSalary = async (req, res) => {
  try {
    const { employeeId, year, month } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const salary = await Salary.create({
      employeeId,
      year,
      month,
      baseSalary: employee.baseSalary
    });

    res.status(201).json(salary);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Get salaries of all employees
 */
const getAllSalaries = async (req, res) => {
  try {
    const { year, month } = req.query;
    console.log("HELLO", year,month)

    const filter = {};
    if (year) filter.year = Number(year);
    if (month) filter.month = Number(month);

    const salaries = await Salary.find(filter)
      .populate("employeeId", "fullName")
      .sort({ year: -1, month: -1 });

    res.json(salaries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * Get salaries of an employee
 */
const getEmployeeSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find({
      employeeId: req.params.employeeId
    }).sort({ year: -1, month: -1 });

    res.json(salaries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Add allowance or deduction
 */
const updateSalaryAdjustments = async (req, res) => {
  try {
    const { allowances, deductions } = req.body;

    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    if (salary.status === "PAID") {
      return res
        .status(400)
        .json({ message: "Paid salary cannot be modified" });
    }

    if (allowances) salary.allowances = allowances;
    if (deductions) salary.deductions = deductions;

    await salary.save();
    res.json(salary);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Pay salary (LOCK)
 */
const paySalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    if (salary.status === "PAID") {
      return res.status(400).json({ message: "Salary already paid" });
    }

    salary.status = "PAID";
    salary.paidAt = new Date();

    await salary.save();
    res.json({ message: "Salary paid successfully", salary });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports ={
    createSalary,
    getEmployeeSalaries,
    updateSalaryAdjustments,
    paySalary,
    getAllSalaries
}
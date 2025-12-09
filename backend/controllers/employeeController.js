const { Error, handleError } = require("../lib/errors");
const Employee = require("../models/Employee");

const createEmployee = async (req, res) => {
  try {
    const { fullName, employeeId, department, designation, phoneNumber, email, joiningDate, baseSalary, gender, nidNumber, presentAddress } = req.body;

    if (!fullName) {
      return Error(res, 400, "Full Name is required");
    }

    const employee = new Employee({
      fullName,
      employeeId,
      department,
      designation,
      phoneNumber,
      email,
      joiningDate,
      baseSalary: baseSalary || 0,
      gender,
      nidNumber,
      presentAddress,
    });

    await employee.save();
    res.status(201).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      count: employees.length,
      employees,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return Error(res, 404, "Employee not found");
    }

    res.status(200).json(employee);
  } catch (err) {
    return handleError(res, err);
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const employee = await Employee.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return Error(res, 404, "Employee not found");
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return Error(res, 404, "Employee not found");
    }

    res.status(200).json({
      message: "Employee deleted successfully",
      employee,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};

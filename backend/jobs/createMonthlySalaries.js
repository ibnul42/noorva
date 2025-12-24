import Employee from "../models/Employee.js";
import Salary from "../models/Salary.js";

export const createMonthlySalaries = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const employees = await Employee.find({});

  for (const emp of employees) {
    const exists = await Salary.findOne({
      employeeId: emp._id,
      year,
      month
    });

    if (!exists) {
      await Salary.create({
        employeeId: emp._id,
        year,
        month,
        baseSalary: emp.baseSalary
      });
    }
  }
};

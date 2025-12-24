const mongoose = require("mongoose");

const allowanceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const deductionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const salarySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    year: Number,
    month: Number,
    baseSalary: Number,

    allowances: { type: [allowanceSchema], default: [] },
    deductions: { type: [deductionSchema], default: [] },

    totalAllowance: { type: Number, default: 0 },
    totalDeduction: { type: Number, default: 0 },
    grossSalary: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },
    paidAt: Date,
  },
  { timestamps: true }
);

salarySchema.pre("save", function (next) {
  if (this.status === "PAID") {
    return next(new Error("Paid salary cannot be modified"));
  }
  next();
});

salarySchema.pre("save", function (next) {
  if (this.status === "PAID") return next();

  const allowances = this.allowances || [];
  const deductions = this.deductions || [];

  this.totalAllowance = allowances.reduce((s, a) => s + a.amount, 0);
  this.totalDeduction = deductions.reduce((s, d) => s + d.amount, 0);

  this.grossSalary = this.baseSalary + this.totalAllowance;
  this.netSalary = this.grossSalary - this.totalDeduction;

  next();
});

// salarySchema.index({ employeeId: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Salary", salarySchema);

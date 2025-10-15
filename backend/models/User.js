const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  // username is optional for regular users but must be unique when provided
  username: { type: String, required: false, unique: true, sparse: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "super-user"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    systemsAccess: {
      employeeDB: { type: Boolean, default: false },
      customerDB: { type: Boolean, default: false },
      remittanceDB: { type: Boolean, default: false },
      officeAccounts: { type: Boolean, default: false },
      agentMFS: { type: Boolean, default: false },
      inventoryInvoice: { type: Boolean, default: false },
    },
    // requestedSystemsAccess holds the systems the user asked access to; requires super-user approval
    requestedSystemsAccess: {
      employeeDB: { type: Boolean, default: false },
      customerDB: { type: Boolean, default: false },
      remittanceDB: { type: Boolean, default: false },
      officeAccounts: { type: Boolean, default: false },
      agentMFS: { type: Boolean, default: false },
      inventoryInvoice: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Set password (stores plain password temporarily in passwordHash, pre-save will hash)
userSchema.methods.setPassword = function (plainPassword) {
  this.passwordHash = plainPassword;
};

// Validate password
userSchema.methods.validatePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);

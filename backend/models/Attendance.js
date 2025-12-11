const mongoose = require("mongoose");
const { Schema } = mongoose;

const attendanceSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Checked In", "Checked Out", "leave", "Absent", "holiday"],
      default: "holiday",
    },
    check_in: { type: Date },
    check_out: { type: Date },
    notes: { type: String },
    worked_minutes: { type: Number, default: 0 }, // total minutes worked in a day
  },
  {
    timestamps: true,
  }
);

// Calculate worked minutes automatically before saving
attendanceSchema.pre("save", function (next) {
  if (this.check_in && this.check_out) {
    const diff = this.check_out.getTime() - this.check_in.getTime();
    this.worked_minutes = Math.floor(diff / 60000); // convert milliseconds to minutes
  }
  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema);

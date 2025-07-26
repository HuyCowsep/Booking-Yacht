const mongoose = require("mongoose");
const { Schema } = mongoose;

const companyYachtScheduleSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  yachtId: { type: Schema.Types.ObjectId, ref: "Yacht", required: true },
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ["active", "cancelled"], default: "active" },
  color: String, // phục vụ FE calendar
  createdBy: { type: Schema.Types.ObjectId, ref: "Account" },
  legacyScheduleId: { type: Schema.Types.ObjectId, ref: "Schedule", required: true },
}, { timestamps: true });

module.exports = mongoose.model("CompanyYachtSchedule", companyYachtScheduleSchema, "companyYachtSchedules"); 
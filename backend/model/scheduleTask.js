const mongoose = require("mongoose");
const { Schema } = mongoose;

const scheduleTaskSchema = new Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "BookingOrder" },
  action: String,
  scheduled_time: Date,
  status: { type: String, enum: ["pending", "done", "failed"], default: "pending" },
  retry_count: { type: Number, default: 0 },
});

module.exports = mongoose.model("ScheduleTask", scheduleTaskSchema, "scheduleTasks");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const yachtScheduleSchema = new Schema({
  yachtId: { type: mongoose.Schema.Types.ObjectId, ref: "Yacht" },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule" },
});

module.exports = mongoose.model("YachtSchedule", yachtScheduleSchema, "yachtSchedules");
//done
const mongoose = require("mongoose");
const { Schema } = mongoose;

const scheduleSchema = new Schema({
  startDate: Date,
  endDate: Date,
});

module.exports = mongoose.model("Schedule", scheduleSchema);
//done
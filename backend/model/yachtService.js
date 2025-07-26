const mongoose = require("mongoose");
const { Schema } = mongoose;

const yachtServiceSchema = new Schema({
  yachtId: { type: mongoose.Schema.Types.ObjectId, ref: "Yacht" },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
});

module.exports = mongoose.model("YachtService", yachtServiceSchema, "yachtServices");

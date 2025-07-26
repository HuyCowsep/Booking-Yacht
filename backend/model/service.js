const mongoose = require("mongoose");
const { Schema } = mongoose;

const ServiceSchema = new Schema({
  serviceName: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Service", ServiceSchema, "services");

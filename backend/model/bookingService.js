const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingServiceSchema = new Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "BookingOrder" },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model(
  "BookingService",
  bookingServiceSchema,
  "bookingServices"
);

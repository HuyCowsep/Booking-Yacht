const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingOrderSchema = new Schema({
  amount: Number,
  bookingDate: { type: Date, default: Date.now },
  amount: Number,
  requirements: String,
  status: String,
  reason: String,
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule" },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", unique: true },
  txnRef: { type: String, unique: true },
});

module.exports = mongoose.model("BookingOrder", bookingOrderSchema, "bookingOrders");

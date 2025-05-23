const mongoose = require("mongoose");
const { Schema } = mongoose;

const billSchema = new Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "BookingOrder" },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
  total: Number,
});

module.exports = mongoose.model("Bill", billSchema, "bills");

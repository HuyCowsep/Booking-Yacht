const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "BookingOrder" },
  transactionDate: Date,
  sender_bank_no: String,
  receiver_bank_no: String,
});

module.exports = mongoose.model("Transaction", transactionSchema, "transactions");

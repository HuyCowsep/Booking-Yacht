const mongoose = require("mongoose");
const { Schema } = mongoose;

const feedbackSchema = new Schema({
  starRating: Number,
  description: String,
  createdAt: { type: Date, default: Date.now },
  idBooking: { type: String, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  yachtId: { type: mongoose.Schema.Types.ObjectId, ref: "Yacht" },
});

module.exports = mongoose.model("Feedback", feedbackSchema, "feedbacks");
//done
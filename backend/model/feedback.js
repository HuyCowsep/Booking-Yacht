const mongoose = require("mongoose");
const { Schema } = mongoose;

const feedbackSchema = new Schema({
  starRating: { type: Number, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  yachtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Yacht",
    required: true,
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema, "feedbacks");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const yachtImageSchema = new Schema({
  yachtId: { type: mongoose.Schema.Types.ObjectId, ref: "Yacht" },
  imageUrl: String,
});

module.exports = mongoose.model("YachtImage", yachtImageSchema);

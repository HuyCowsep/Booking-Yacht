const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomTypeSchema = new Schema({
  type: String,
  utility: String,
  price: Number,
  yachtId: { type: Schema.Types.ObjectId, ref: "Yacht" },
});

module.exports = mongoose.model('RoomType', roomTypeSchema, 'roomTypes');

const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomSchema = new Schema({
  name: String,
  description: String,
  area: Number,
  avatar: String,
  max_people: Number,
  roomTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "RoomType" },
  yachtId: { type: mongoose.Schema.Types.ObjectId, ref: "Yacht" },
});

module.exports = mongoose.model("Room", roomSchema);

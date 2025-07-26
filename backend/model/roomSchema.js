const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomSchema = new Schema({
  name: String,
  description: String,
  area: Number,
  avatar: String,
  max_people: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 2,
  },
  quantity: {
    type: Number,
    required: true,
  }, // số lượng của phòng có
  roomTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "RoomType" },
  yachtId: { type: mongoose.Schema.Types.ObjectId, ref: "Yacht" },
  quantity: Number,
});

module.exports = mongoose.model("Room", roomSchema, "rooms");

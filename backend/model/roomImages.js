const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomImageSchema = new Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  imageRoomUrl: String,
});

module.exports = mongoose.model("RoomImage", roomImageSchema);

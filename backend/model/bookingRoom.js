const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingRoomSchema = new Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "BookingOrder" },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
});

module.exports = mongoose.model("BookingRoom", bookingRoomSchema, "bookingRooms");

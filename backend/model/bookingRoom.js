const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingRoomSchema = new Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookingOrder",
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model(
  "BookingRoom",
  bookingRoomSchema,
  "bookingRooms"
);

const {Room, BookingRoom, BookingOrder, RoomType} = require("../model/roomSchema");

const getRoomsWithTypes = async (req, res) => {
  try {
    const { yachtId, scheduleId, maxPeople } = req.query;
    if (!yachtId) {
      return res.status(400).json({
        success: false,
        message: "yachtId is required",
      });
    }

    // Build query
    const query = { yachtId };
    if (maxPeople && maxPeople !== "all") {
      query.max_people = parseInt(maxPeople);
    }

    // Find rooms and populate roomTypeId
    let rooms = await Room.find(query).populate({
      path: "roomTypeId",
      select: "name price",
    });

    // Filter out booked rooms if scheduleId is provided
    if (scheduleId) {
      const bookings = await BookingOrder.find({ scheduleId });
      const bookedRoomIds = await BookingRoom.find({
        bookingId: { $in: bookings.map((b) => b._id) },
      }).distinct("roomId");
      rooms = rooms.filter((room) => !bookedRoomIds.includes(room._id));
    }

    // Format rooms for the frontend
    const formattedRooms = rooms.map((room) => ({
      id: room._id,
      name: room.name,
      description: room.description,
      area: room.area,
      avatar: room.avatar,
      max_people: room.max_people,
      price: room.roomTypeId?.price || 0,
    }));

    res.status(200).json({
      success: true,
      message: "Lấy danh sách phòng thành công",
      data: { rooms: formattedRooms },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách phòng",
      error: error.message,
    });
  }
};

module.exports = { getRoomsWithTypes };

const Room = require("../model/roomSchema");
const BookingRoom = require("../model/bookingRoom");
const BookingOrder = require("../model/bookingOrder");
const RoomType = require("../model/roomType");
const Yacht = require("../model/yachtSchema");

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
      select: "type utility price",
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
      roomTypeId: room.roomTypeId,
      price: room.roomTypeId?.price || 0,
      quantity: room.quantity || 0,
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

const createRoom = async (req, res) => {
  try {
    // FE gửi lên: roomName, area, description, idRoomType, avatar, idYacht, quantity
    const { roomName, area, description, idRoomType, idYacht, quantity } = req.body;

    if (!roomName || !area || !idRoomType || !idYacht || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Lưu avatar như phần tạo yacht
    const avatar = req.file && req.file.path ? req.file.path : "";

    const data = new Room({
      name: roomName,
      description,
      area,
      avatar,
      quantity,
      roomTypeId: idRoomType,
      yachtId: idYacht,
    });

    await data.save();

    res.status(201).json({
      message: "Room created successfully",
      data,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const {
      roomName, // FE truyền roomName
      description,
      quantity
    } = req.body;

    // Chuẩn bị dữ liệu update
    const updateData = {
      name: roomName, // map sang name
      description,
      quantity,
      updatedAt: Date.now()
    };
    // Nếu có file avatar mới
    if (req.file && req.file.path) {
      updateData.avatar = req.file.path;
    }
    // Xóa các trường undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedRoom = await Room.findByIdAndUpdate(roomId, updateData, { new: true, runValidators: true });
    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({
      message: 'Room updated successfully',
      data: updatedRoom
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createRoomType = async (req, res) => {
  try {
    const { type, utility, price, yachtId } = req.body;

    if (!type || !utility || !price || !yachtId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const data = new RoomType({
      type,
      utility,
      price,
      yachtId,
    });

    await data.save();

    res.status(201).json({
      message: "Room type created successfully",
      data,
    });
  } catch (error) {
    console.error("Error creating room type:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Lấy tất cả room type theo yachtId
const getAllRoomTypeByYachtId = async (req, res) => {
  try {
    const { yachtId } = req.query;
    if (!yachtId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu yachtId!",
      });
    }
    const roomTypes = await RoomType.find({ yachtId });
    res.status(200).json({
      success: true,
      message: "Lấy danh sách loại phòng theo du thuyền thành công!",
      data: roomTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy loại phòng theo du thuyền!",
      error: error.message,
    });
  }
};

const updateRoomType = async (req, res) => {
  try {
    const roomTypeId = req.params.id;
    const { price, type, utilities } = req.body;
    const updateData = {
      price,
      type,
      utility: utilities,
      updatedAt: Date.now()
    };
    // Xóa các trường undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    const updatedRoomType = await RoomType.findByIdAndUpdate(roomTypeId, updateData, { new: true, runValidators: true });
    if (!updatedRoomType) {
      return res.status(404).json({ message: 'Room type not found' });
    }
    res.status(200).json({ message: 'Room type updated successfully', data: updatedRoomType });
  } catch (error) {
    console.error('Error updating room type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteRoomType = async (req, res) => {
  try {
    const roomTypeId = req.params.id;
    const deleted = await RoomType.findByIdAndDelete(roomTypeId);
    if (!deleted) {
      return res.status(404).json({ message: 'Room type not found' });
    }
    res.status(200).json({ message: 'Room type deleted successfully' });
  } catch (error) {
    console.error('Error deleting room type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy tất cả phòng theo yachtId
const getAllRoomByYachtId = async (req, res) => {
  try {
    const { yachtId } = req.query;
    if (!yachtId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu yachtId!",
      });
    }
    const yacht = await Yacht.findById(yachtId);
    // Populate roomTypeId để trả về thông tin loại phòng
    const rooms = await Room.find({ yachtId }).populate('roomTypeId');
    res.status(200).json({
      success: true,
      message: "Lấy danh sách phòng theo du thuyền thành công!",
      data: {
        rooms,
        maxRoom: yacht.maxRoom,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy phòng theo du thuyền!",
      error: error.message,
    });
  }
};

module.exports = { getRoomsWithTypes, createRoom, createRoomType, getAllRoomTypeByYachtId, getAllRoomByYachtId, updateRoom, updateRoomType, deleteRoomType };

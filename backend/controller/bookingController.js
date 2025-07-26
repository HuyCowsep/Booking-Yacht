const {
  BookingOrder,
  BookingRoom,
  Invoice,
  Transaction,
  Customer,
  Yacht,
  Service,
  BookingService,
  Room,
} = require("../model");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const {
  sendConsultationEmail,
  sendBookingConfirmationEmail,
} = require("../utils/sendMail");

const parseGuestCount = (guestCountValue) => {
  if (typeof guestCountValue === "number") {
    return guestCountValue;
  }
  if (typeof guestCountValue === "string") {
    const numbers = guestCountValue.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      return numbers.reduce((sum, num) => sum + parseInt(num), 0);
    }
  }
  return 1;
};

// ==================== BOOKING ROOM FUNCTIONS ====================
exports.createBookingOrConsultationRequest = asyncHandler(async (req, res) => {
  const {
    yachtId,
    scheduleId,
    checkInDate,
    guestCount,
    selectedRooms,
    totalPrice,
    requirements,
    fullName,
    phoneNumber,
    email,
    address,
    requestType = "consultation_requested",
    selectedServices,
  } = req.body;

  const requiredFields = {
    yachtId,
    checkInDate,
    guestCount,
    fullName,
    phoneNumber,
    email,
  };
  const missingFields = Object.entries(requiredFields)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Thiếu thông tin bắt buộc: ${missingFields.join(", ")}`,
      missingFields,
    });
  }

  const validRequestTypes = ["pending_payment", "consultation_requested"];

  if (!validRequestTypes.includes(requestType)) {
    return res.status(400).json({
      success: false,
      message: "Loại yêu cầu không hợp lệ.",
    });
  }

  if (
    requestType === "pending_payment" &&
    (totalPrice === undefined || totalPrice <= 0)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Tổng giá là bắt buộc và phải lớn hơn 0 cho yêu cầu đặt trực tiếp.",
    });
  }

  if (
    !selectedRooms ||
    !Array.isArray(selectedRooms) ||
    selectedRooms.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng chọn ít nhất một phòng.",
    });
  }

  const checkIn = new Date(checkInDate);

  if (isNaN(checkIn.getTime()) || checkIn < new Date()) {
    return res.status(400).json({
      success: false,
      message: "Ngày check-in không hợp lệ hoặc đã qua.",
    });
  }

  if (!req.user.customerId) {
    return res.status(401).json({
      success: false,
      message: "Không tìm thấy thông tin khách hàng từ token.",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Kiểm tra yacht và maxRoom
    const yacht = await Yacht.findById(yachtId).session(session);
    if (!yacht) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy du thuyền",
      });
    }

    // Kiểm tra tổng số phòng đặt không vượt quá maxRoom
    const totalRoomsBooked = selectedRooms.reduce(
      (sum, room) => sum + room.roomQuantity,
      0
    );
    if (yacht.maxRoom && totalRoomsBooked > yacht.maxRoom) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Tổng số phòng đặt (${totalRoomsBooked}) vượt quá số phòng tối đa của du thuyền (${yacht.maxRoom})`,
      });
    }

    // Kiểm tra quantity của từng loại phòng
    for (const roomBooking of selectedRooms) {
      const room = await Room.findById(roomBooking.roomId).session(session);
      if (!room) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy phòng với id ${roomBooking.roomId}`,
        });
      }
      if (room.quantity && roomBooking.roomQuantity > room.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Số lượng đặt (${roomBooking.roomQuantity}) vượt quá số lượng có sẵn (${room.quantity}) của phòng ${room.name}`,
        });
      }
    }

    const customer = await Customer.findById(req.user.customerId).session(
      session
    );
    if (!customer) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin khách hàng.",
      });
    }
    const existingBooking = await BookingOrder.findOne({
      customer: req.user.customerId,
      yacht: yachtId,
      checkInDate: checkIn,
      status: { $in: ["consultation_requested", "pending_payment"] },
    }).session(session);

    if (existingBooking) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message:
          "Bạn đã có yêu cầu chưa hoàn thành với thuyền này cho ngày này. Vui lòng hoàn thành hoặc hủy yêu cầu cũ trước khi tạo mới.",
      });
    }

    const customerUpdates = {};
    if (fullName && customer.fullName !== fullName)
      customerUpdates.fullName = fullName;
    if (phoneNumber && customer.phoneNumber !== phoneNumber)
      customerUpdates.phoneNumber = phoneNumber;
    if (email && customer.email !== email) customerUpdates.email = email;
    if (address && customer.address !== address)
      customerUpdates.address = address;

    if (Object.keys(customerUpdates).length > 0) {
      Object.assign(customer, customerUpdates);
      await customer.save({ session });
    }

    const totalGuestCount = parseGuestCount(guestCount);
    // Xử lý room/service chỉ lưu id và quantity
    const processedRooms = await Promise.all(
      selectedRooms.map(async (room) => {
        const roomId = room.roomId || room.id;
        const quantity = room.roomQuantity || room.quantity || 1;
        // Lấy giá phòng từ model Room
        let price = 0;
        const roomDoc = await mongoose.model("Room").findById(roomId);
        if (roomDoc && typeof roomDoc.price === "number") price = roomDoc.price;
        return {
          roomId,
          quantity,
          price,
        };
      })
    );
    // Khi tạo bookingOrder:
    const processedServices = (selectedServices || []).map((service) => ({
      serviceId: service.serviceId || service._id || service.id,
      quantity: service.serviceQuantity || service.quantity || 1,
      // Không lưu price/serviceName
    }));

    // Lấy address: nếu không có trong req.body thì lấy từ customer
    let bookingAddress = address;
    if (!bookingAddress) {
      bookingAddress = customer.address || "";
    }
    // Tạo bookingOrder chỉ với các trường ref và nghiệp vụ
    const isSameAsCustomer =
      fullName === customer.fullName &&
      phoneNumber === customer.phoneNumber &&
      email === customer.email &&
      bookingAddress === customer.address;
    const newBookingOrderData = {
      customer: customer._id,
      yacht: yachtId,
      schedule: scheduleId || null,
      status: requestType,
      requirements: requirements || "", // vẫn lưu ở đây nếu cần backward compatibility
      guestCount: totalGuestCount,
      adults: req.body.adults ?? 1,
      childrenUnder10: req.body.childrenUnder10 ?? 0,
      childrenAbove10: req.body.childrenAbove10 ?? 0,
      checkInDate: checkIn,
      paymentBreakdown: {
        totalAmount: totalPrice || 0,
        // các trường khác để mặc định
      },
      consultationData: {
        requirements: requirements || "", // Lưu requirements vào đúng trường trong consultationData
        respondedAt: req.body.consultationData?.respondedAt || null,
        requestedRooms: processedRooms || [],
        requestServices: processedServices || [],
        estimatedPrice: totalPrice || 0,
      },
      // Lưu snapshot customerInfo
      customerInfo: isSameAsCustomer
        ? undefined
        : {
            fullName,
            phoneNumber,
            email,
            address: bookingAddress,
          },
      address: bookingAddress,
    };
    if (!isSameAsCustomer) {
      newBookingOrderData.customerInfo = {
        fullName,
        phoneNumber,
        email,
        address,
      };
    }

    const newBookingOrder = new BookingOrder(newBookingOrderData);
    const savedBookingOrder = await newBookingOrder.save({ session });

    // Lưu phòng vào BookingRoom
    for (const room of processedRooms) {
      let price = room.roomPrice;
      if (price === undefined || price === null) {
        // Nếu không có roomPrice từ FE, lấy từ DB (Room -> RoomType)
        const roomDoc = await mongoose.model("Room").findById(room.roomId);
        if (!roomDoc || !roomDoc.roomTypeId) {
          await session.abortTransaction();
          return res.status(400).json({
            success: false,
            message: `Không tìm thấy roomTypeId cho roomId: ${room.roomId}`,
          });
        }
        const roomTypeDoc = await mongoose
          .model("RoomType")
          .findById(roomDoc.roomTypeId);
        if (!roomTypeDoc || typeof roomTypeDoc.price !== "number") {
          await session.abortTransaction();
          return res.status(400).json({
            success: false,
            message: `Không tìm thấy giá phòng cho roomTypeId: ${roomDoc.roomTypeId}`,
          });
        }
        price = roomTypeDoc.price;
      }
      await BookingRoom.create(
        [
          {
            bookingId: savedBookingOrder._id,
            roomId: room.roomId,
            quantity: room.quantity,
            price: price,
          },
        ],
        { session }
      );
    }
    // Lưu dịch vụ vào BookingService
    for (const service of processedServices) {
      // Lấy giá dịch vụ từ DB
      const serviceDoc = await mongoose
        .model("Service")
        .findById(service.serviceId);
      if (!serviceDoc) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Không tìm thấy dịch vụ với ID: ${service.serviceId}`,
        });
      }
      await BookingService.create(
        [
          {
            bookingId: savedBookingOrder._id,
            serviceId: service.serviceId,
            quantity: service.quantity,
            price: serviceDoc.price, // Đảm bảo luôn có giá
          },
        ],
        { session }
      );
    }

    // Gửi email xác nhận theo loại booking
    try {
      const checkInDateStr = new Date(
        savedBookingOrder.checkInDate
      ).toLocaleDateString("vi-VN");
      if (requestType === "consultation_requested") {
        await sendConsultationEmail(
          email,
          fullName,
          savedBookingOrder.bookingCode,
          checkInDateStr,
          savedBookingOrder.guestCount,
          requirements
        );
      } else if (requestType === "pending_payment") {
        await sendBookingConfirmationEmail(
          email,
          fullName,
          savedBookingOrder.bookingCode,
          checkInDateStr,
          savedBookingOrder.guestCount,
          savedBookingOrder.paymentBreakdown.totalAmount?.toLocaleString(
            "vi-VN"
          )
        );
      }
    } catch (mailErr) {
      // Không throw lỗi này để không ảnh hưởng tới booking, chỉ log lại
    }

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message:
        requestType === "pending_payment"
          ? "Yêu cầu đặt chỗ đã được tạo. Vui lòng tiến hành thanh toán."
          : "Yêu cầu tư vấn của bạn đã được gửi thành công.",
      data: {
        bookingId: savedBookingOrder.bookingId || savedBookingOrder._id,
        bookingCode: savedBookingOrder.bookingCode,
        confirmationCode: savedBookingOrder.confirmationCode,
        status: savedBookingOrder.status,
        amount: savedBookingOrder.paymentBreakdown.totalAmount,
        paymentBreakdown: savedBookingOrder.paymentBreakdown,
        selectedServices: selectedServices,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    return res
      .status(500)
      .json({ success: false, message: "Internal error", error: err.message });
  } finally {
    session.endSession();
  }
});

exports.getConsultationRequest = asyncHandler(async (req, res) => {
  const { yachtId, checkInDate } = req.query;
  const customerId = req.user.customerId;

  if (!customerId || !yachtId) {
    return res.status(400).json({
      success: false,
      message: "Thiếu customerId hoặc yachtId.",
    });
  }

  const query = {
    customer: customerId,
    yacht: yachtId,
    status: "consultation_requested",
  };

  // Nếu có checkInDate, thêm vào query để tìm chính xác
  if (checkInDate) {
    query.checkInDate = new Date(checkInDate);
  }

  const consultation = await BookingOrder.findOne(query)
    .populate({
      path: "schedule",
      populate: { path: "scheduleId", select: "startDate endDate" },
    })
    .populate({
      path: "consultationData.requestedRooms.roomId",
      select:
        "name area price description avatar max_people roomTypeId yachtId",
      populate: { path: "roomTypeId", select: "type utility price" },
    })
    .lean();

  if (!consultation) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy yêu cầu tư vấn.",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      bookingId: consultation._id.toString(),
      bookingCode: consultation.bookingCode,
      confirmationCode: consultation.confirmationCode,
      fullName: consultation.customerInfo.fullName,
      email: consultation.customerInfo.email,
      phoneNumber: consultation.customerInfo.phoneNumber,
      address: consultation.customerInfo.address || "",
      checkInDate: consultation.checkInDate,
      guestCount: consultation.guestCount,
      adults: consultation.adults ?? 1,
      childrenUnder10: consultation.childrenUnder10 ?? 0,
      childrenAbove10: consultation.childrenAbove10 ?? 0,
      requirements: consultation.requirements,
      selectedRooms: consultation.consultationData.requestedRooms,
      totalPrice: consultation.consultationData.estimatedPrice,
      yachtId: consultation.yacht,
      scheduleId: consultation.schedule || null,
      selectedServices: consultation.consultationData.requestServices,
    },
  });
});

exports.customerConfirmBookingAfterConsultation = asyncHandler(
  async (req, res) => {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res
        .status(400)
        .json({ success: false, message: "Booking ID không hợp lệ." });
    }

    if (!req.user.customerId) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy thông tin khách hàng từ token.",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await BookingOrder.findById(bookingId).session(session);

      if (!booking) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ success: false, message: "Booking không tồn tại." });
      }

      if (booking.customer.toString() !== req.user.customerId) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({
          success: false,
          message: "Không có quyền xác nhận booking này.",
        });
      }

      if (booking.status !== "consultation_requested") {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message:
            "Booking không ở trạng thái cho phép xác nhận hoặc đã được xử lý.",
        });
      }

      booking.status = "pending_payment";

      const savedBooking = await booking.save({ session });

      try {
        const populatedBooking = await BookingOrder.findById(savedBooking._id)
          .populate("yacht", "name")
          .lean();

        const yachtName = populatedBooking.yacht?.name || "(Không rõ)";
        const checkInDateStr = new Date(
          populatedBooking.checkInDate
        ).toLocaleDateString("vi-VN");

        const rooms = (populatedBooking.consultationData?.requestedRooms || [])
          .map(
            (room) =>
              `<li>${room.roomName} x ${room.quantity} (${
                room.roomArea || "?"
              }m²) - ${room.roomPrice?.toLocaleString("vi-VN") || "?"} VNĐ</li>`
          )
          .join("");
        const roomListHtml = rooms ? `<ul>${rooms}</ul>` : "Không có";
        const requirements = populatedBooking.requirements || "Không có";

        const { sendBookingConfirmationEmail } = require("../utils/sendMail");
        await sendBookingConfirmationEmail(
          populatedBooking.customerInfo?.email || "",
          populatedBooking.customerInfo?.fullName || "",
          populatedBooking.bookingCode,
          checkInDateStr,
          populatedBooking.guestCount,
          populatedBooking.paymentBreakdown.totalAmount?.toLocaleString(
            "vi-VN"
          ),
          {
            yachtName,
            roomListHtml,
            requirements,
          }
        );
      } catch (mailErr) {
        console.error(
          "Lỗi gửi email xác nhận đặt phòng sau tư vấn:",
          mailErr.message
        );
      }

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        message: "Xác nhận booking thành công. Vui lòng tiến hành thanh toán.",
        data: {
          bookingId: savedBooking._id.toString(),
          bookingCode: savedBooking.bookingCode,
          status: savedBooking.status,
          amountToPay: savedBooking.paymentBreakdown.totalAmount,
          paymentBreakdown: savedBooking.paymentBreakdown,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Lỗi customer confirm booking after consultation:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi xác nhận booking.",
        error: error.message,
      });
    }
  }
);

// ==================== BOOKING STATUS MANAGEMENT ====================

exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, scheduleId } = req.body; // scheduleId might be needed if confirming

  const validStatuses = [
    "consultation_requested",
    "consultation_sent",
    "confirmed",
    "completed",
    "cancelled",
    "rejected",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status không hợp lệ",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await BookingOrder.findById(id).session(session);

    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Booking không tồn tại",
      });
    }

    // Authorization check: (Example - adapt if admin/staff roles exist)
    // For customer updates, ensure they own the booking
    // For admin updates, check role
    if (req.user.role !== "admin") {
      // Assuming a role system
      const customer = await Customer.findOne({
        accountId: req.user._id,
      }).session(session);
      if (
        !customer ||
        booking.customer.toString() !== customer._id.toString()
      ) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({
          success: false,
          message: "Không có quyền cập nhật booking này",
        });
      }
    }

    const oldStatus = booking.status;
    booking.status = status;

    // === CẬP NHẬT SỐ LƯỢNG PHÒNG ===
    // Đã đồng bộ: Logic trừ phòng chỉ thực hiện ở paymentController khi thanh toán thành công.
    // (Đoạn code trừ phòng ở đây đã được xoá để tránh double booking)
    // Cộng lại phòng khi sang cancelled từ confirmed/confirmed_deposit với paymentStatus phù hợp
    if (
      status === "cancelled" &&
      ((oldStatus === "confirmed" && booking.paymentStatus === "full_paid") ||
        (oldStatus === "confirmed_deposit" &&
          booking.paymentStatus === "deposit_paid"))
    ) {
      const rooms = booking.consultationData?.requestedRooms || [];
      for (const room of rooms) {
        const roomId = room.roomId?._id || room.roomId;
        const qty = room.quantity || 1;
        if (roomId) {
          await Room.findByIdAndUpdate(
            roomId,
            { $inc: { quantity: qty } },
            { session }
          );
        }
      }
    }

    if (status === "confirmed") {
      if (scheduleId) booking.schedule = scheduleId; // Update schedule if provided
      const existingBookingRooms = await BookingRoom.find({
        bookingId: booking._id,
      }).session(session);
      if (
        existingBookingRooms.length === 0 &&
        booking.consultationData &&
        booking.consultationData.requestedRooms &&
        booking.consultationData.requestedRooms.length > 0
      ) {
        const bookingRoomPromises = booking.consultationData.requestedRooms.map(
          (roomData) => {
            const newBookingRoom = new BookingRoom({
              bookingId: booking._id,
              roomId: roomData.roomId,
              quantity: roomData.quantity,
              price: roomData.roomPrice,
            });
            return newBookingRoom.save({ session });
          }
        );
        await Promise.all(bookingRoomPromises);
      }
    }
    // pre-save hook handles other status-related timestamps (cancelledAt, etc.)

    const updatedBooking = await booking.save({ session });
    await updatedBooking.populate([
      { path: "customer", select: "fullName phoneNumber email" },
      // Add other populates if needed for the response
    ]);

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      data: updatedBooking,
      message: `Booking status đã được cập nhật thành ${status}.`,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật status booking.",
      error: error.message,
    });
  }
});

exports.confirmBooking = asyncHandler(async (req, res) => {
  const { id } = req.params; // BookingOrder ID
  const { scheduleId, selectedServices = [] } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Thiếu Booking ID",
    });
  }
  // scheduleId might be optional if already set or not applicable for this confirmation type

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await BookingOrder.findById(id).session(session);
    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy booking với ID: ${id}`,
      });
    }

    if (booking.status === "confirmed") {
      await session.abortTransaction(); // No need to re-confirm
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Booking này đã được xác nhận trước đó.",
      });
    }

    // Typically, confirmation moves from 'consultation_requested' or 'consultation_sent'
    if (
      !["consultation_requested", "consultation_sent"].includes(booking.status)
    ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Booking không ở trạng thái cho phép xác nhận (hiện tại: ${booking.status})`,
      });
    }

    booking.status = "confirmed";
    if (scheduleId) {
      booking.schedule = scheduleId;
    }
    // booking.confirmedAt and booking.confirmationCode will be set by pre-save hook in BookingOrder model

    // === CẬP NHẬT SỐ LƯỢNG PHÒNG ===
    // Chỉ trừ phòng khi status và paymentStatus phù hợp
    if (
      (booking.status === "confirmed" &&
        booking.paymentStatus === "full_paid") ||
      (booking.status === "confirmed_deposit" &&
        booking.paymentStatus === "deposit_paid")
    ) {
      const rooms = booking.consultationData?.requestedRooms || [];
      for (const room of rooms) {
        const roomId = room.roomId?._id || room.roomId;
        const qty = room.quantity || 1;
        if (roomId) {
          await Room.findByIdAndUpdate(
            roomId,
            { $inc: { quantity: -qty } },
            { session }
          );
        }
      }
    }

    // Create BookingRoom entries from consultationData.requestedRooms
    const existingBookingRooms = await BookingRoom.find({
      bookingId: booking._id,
    }).session(session);
    if (
      existingBookingRooms.length === 0 &&
      booking.consultationData &&
      booking.consultationData.requestedRooms &&
      booking.consultationData.requestedRooms.length > 0
    ) {
      const bookingRoomPromises = booking.consultationData.requestedRooms.map(
        (roomData) => {
          const newBookingRoom = new BookingRoom({
            bookingId: booking._id,
            roomId: roomData.roomId,
            quantity: roomData.quantity,
            price: roomData.roomPrice,
          });
          return newBookingRoom.save({ session });
        }
      );
      await Promise.all(bookingRoomPromises);
    } else if (existingBookingRooms.length === 0) {
    }

    // Lưu các dịch vụ đi kèm khi xác nhận booking
    const requestServices = booking.consultationData?.requestServices || [];
    if (Array.isArray(requestServices) && requestServices.length > 0) {
      await BookingService.deleteMany({ bookingId: booking._id }, { session }); // Xóa cũ nếu có
      // Lấy giá dịch vụ từ DB cho từng service
      const bookingServiceDocs = [];
      for (const service of requestServices) {
        const serviceDoc = await mongoose
          .model("Service")
          .findById(service.serviceId);
        if (!serviceDoc) {
          await session.abortTransaction();
          return res.status(400).json({
            success: false,
            message: `Không tìm thấy dịch vụ với ID: ${service.serviceId}`,
          });
        }
        bookingServiceDocs.push({
          bookingId: booking._id,
          serviceId: service.serviceId,
          price: serviceDoc.price,
          quantity: service.quantity,
        });
      }
      await BookingService.insertMany(bookingServiceDocs, { session });
    }

    const updatedBooking = await booking.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Booking đã được xác nhận!",
      data: {
        id: updatedBooking._id.toString(),
        bookingCode: updatedBooking.bookingCode,
        confirmationCode: updatedBooking.confirmationCode,
        status: updatedBooking.status,
        schedule: updatedBooking.schedule,
        // Include other relevant details
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: "Lỗi server khi xác nhận booking",
      error: error.message,
    });
  }
});

exports.rejectBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await BookingOrder.findById(id).session(session);

    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Booking không tồn tại",
      });
    }

    // Authorization (customer or admin)
    // This is a simplified check, adapt to your auth logic
    let canCancel = false;
    if (req.user.role === "admin") {
      // Assuming admin role
      canCancel = true;
    } else {
      const customer = await Customer.findOne({
        accountId: req.user._id,
      }).session(session);
      if (customer && booking.customer.toString() === customer._id.toString()) {
        canCancel = true;
      }
    }

    if (!canCancel) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: "Không có quyền hủy/từ chối booking này",
      });
    }

    if (booking.status === "cancelled" || booking.status === "rejected") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Booking này đã được hủy hoặc từ chối trước đó.",
      });
    }

    // Use "cancelled" for customer-initiated, "rejected" for staff-initiated
    // For simplicity, this function handles both as a general "rejection/cancellation"
    // You might want separate functions or pass a reason.
    booking.status = "cancelled"; // Or "rejected" depending on who is acting
    // booking.cancelledAt will be set by pre-save hook

    const updatedBooking = await booking.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      data: updatedBooking,
      message: "Booking đã được hủy/từ chối.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "Lỗi server khi hủy/từ chối booking.",
      error: error.message,
    });
  }
});
// NEW: Controller to UPDATE an existing request
exports.updateBookingOrConsultationRequest = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const {
    yachtId,
    scheduleId,
    checkInDate,
    guestCount,
    selectedRooms,
    totalPrice,
    requirements,
    fullName,
    phoneNumber,
    email,
    address,
    requestType, // 'consultation_requested' or 'pending_payment'
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res
      .status(400)
      .json({ success: false, message: "Booking ID không hợp lệ." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bookingOrder = await BookingOrder.findById(bookingId).session(
      session
    );

    if (!bookingOrder) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy yêu cầu booking." });
    }

    // Authorization: Ensure the user owns this booking
    if (bookingOrder.customer.toString() !== req.user.customerId) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền chỉnh sửa yêu cầu này.",
      });
    }

    // State validation: Only allow edits on 'consultation_requested' status
    if (bookingOrder.status !== "consultation_requested") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Không thể chỉnh sửa yêu cầu ở trạng thái "${bookingOrder.status}".`,
      });
    }

    // Update customer info if it has changed
    if (fullName) bookingOrder.customerInfo.fullName = fullName;
    if (phoneNumber) bookingOrder.customerInfo.phoneNumber = phoneNumber;
    if (email) bookingOrder.customerInfo.email = email;
    if (address) bookingOrder.customerInfo.address = address;

    // Cập nhật các trường ref và nghiệp vụ
    bookingOrder.yacht = yachtId;
    bookingOrder.schedule = scheduleId || null;
    bookingOrder.checkInDate = new Date(checkInDate);
    bookingOrder.guestCount = parseInt(guestCount, 10) || 1;
    if (typeof req.body.childrenUnder10 !== "undefined") {
      bookingOrder.childrenUnder10 = req.body.childrenUnder10;
    }
    if (typeof req.body.childrenAbove10 !== "undefined") {
      bookingOrder.childrenAbove10 = req.body.childrenAbove10;
    }
    bookingOrder.requirements = requirements || "";
    bookingOrder.amount = totalPrice || 0;
    if (typeof req.body.adults !== "undefined") {
      bookingOrder.adults = req.body.adults;
    }
    bookingOrder.status = requestType;
    // Cập nhật consultationData nếu có
    if (req.body.consultationData) {
      bookingOrder.consultationData.notes =
        req.body.consultationData.notes || "";
      bookingOrder.consultationData.respondedAt =
        req.body.consultationData.respondedAt || null;
    }
    // Luôn cập nhật các trường phòng/dịch vụ/tổng tiền tư vấn
    bookingOrder.consultationData.requestedRooms = (selectedRooms || []).map(
      (room) => ({
        roomId: room.roomId || room.id,
        quantity: room.roomQuantity || room.quantity || 1,
      })
    );
    bookingOrder.consultationData.requestServices = (
      Array.isArray(req.body.selectedServices) ? req.body.selectedServices : []
    ).map((service) => ({
      serviceId: service.serviceId || service._id || service.id,
      quantity: service.serviceQuantity || service.quantity || 1,
      // Không lưu price/serviceName
    }));
    bookingOrder.consultationData.estimatedPrice = totalPrice || 0;
    // Cập nhật requirements vào consultationData (theo model)
    bookingOrder.consultationData.requirements = requirements || "";
    const savedBookingOrder = await bookingOrder.save({ session });

    // Nếu chuyển sang pending_payment, cập nhật lại BookingRoom
    if (requestType === "pending_payment") {
      await BookingRoom.deleteMany(
        { bookingId: savedBookingOrder._id },
        { session }
      );
      for (const room of selectedRooms) {
        await BookingRoom.create(
          [
            {
              bookingId: savedBookingOrder._id,
              roomId: room.roomId,
              quantity: room.roomQuantity,
              price: room.roomPrice,
            },
          ],
          { session }
        );
      }
    }
    // Cập nhật lại BookingService nếu có thay đổi dịch vụ
    if (Array.isArray(req.body.selectedServices)) {
      await BookingService.deleteMany(
        { bookingId: savedBookingOrder._id },
        { session }
      );
      for (const service of req.body.selectedServices) {
        const serviceDoc = await mongoose
          .model("Service")
          .findById(service.serviceId);
        if (!serviceDoc) {
          await session.abortTransaction();
          return res.status(400).json({
            success: false,
            message: `Không tìm thấy dịch vụ với ID: ${service.serviceId}`,
          });
        }
        await BookingService.create(
          [
            {
              bookingId: savedBookingOrder._id,
              serviceId: service.serviceId,
              quantity: service.quantity,
              price: serviceDoc.price,
            },
          ],
          { session }
        );
      }
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message:
        requestType === "pending_payment"
          ? "Yêu cầu đã được cập nhật. Vui lòng thanh toán."
          : "Yêu cầu tư vấn đã được cập nhật.",
      data: {
        bookingId: savedBookingOrder._id.toString(),
        bookingCode: savedBookingOrder.bookingCode,
        status: savedBookingOrder.status,
        childrenAbove10: savedBookingOrder.childrenAbove10,
        childrenUnder10: savedBookingOrder.childrenUnder10,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xử lý yêu cầu.",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
});

// NEW: Controller to DELETE a consultation request
exports.cancelConsultationRequest = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res
      .status(400)
      .json({ success: false, message: "Booking ID không hợp lệ." });
  }

  const bookingOrder = await BookingOrder.findOne({
    _id: bookingId,
    customer: req.user.customerId, // Ensure ownership
  });

  if (!bookingOrder) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy yêu cầu tư vấn hoặc bạn không có quyền.",
    });
  }

  // Only allow deletion if it's still just a request
  if (bookingOrder.status !== "consultation_requested") {
    return res.status(400).json({
      success: false,
      message: "Không thể hủy yêu cầu đã được xử lý.",
    });
  }

  await bookingOrder.deleteOne();

  res.status(200).json({
    success: true,
    message: "Yêu cầu tư vấn đã được hủy thành công.",
  });
});

// ==================== BOOKING RETRIEVAL FUNCTIONS ====================

exports.getBookingWithTransactions = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await BookingOrder.findById(id)
      .populate("customer", "fullName phoneNumber email address") // Added address
      .populate("yacht", "name image location")
      .populate("schedule", "startDate endDate");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking không tồn tại",
      });
    }

    // Authorization
    let canAccess = false;
    if (req.user.role === "admin") {
      canAccess = true;
    } else {
      const customer = await Customer.findOne({ accountId: req.user._id });
      if (
        customer &&
        booking.customer._id.toString() === customer._id.toString()
      ) {
        canAccess = true;
      }
    }
    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập booking này",
      });
    }

    const transactions = await Transaction.find({ bookingId: id }).sort({
      createdAt: -1,
    });
    const bookedRooms = await BookingRoom.find({ bookingId: id }).populate(
      "roomId",
      "name price area description images"
    ); // Populate more room details
    const invoices = await Invoice.find({ bookingId: id }).sort({
      createdAt: -1,
    });

    // Lấy dịch vụ đã lưu
    const services = await BookingService.find({
      bookingId: booking._id,
    }).populate("serviceId");

    res.json({
      success: true,
      data: {
        booking,
        transactions,
        bookedRooms,
        invoices, // Replaced 'bill' with 'invoices' as it's an array
        services, // Thêm dòng này
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy booking.",
      error: error.message,
    });
  }
});

exports.getCustomerBookings = asyncHandler(async (req, res) => {
  if (!req.user.customerId) {
    return res.status(401).json({
      success: false,
      message: "Không tìm thấy thông tin khách hàng từ token.",
    });
  }

  let bookings = await BookingOrder.find({ customer: req.user.customerId })
    .populate("yacht", "name image location")
    .populate("schedule", "startDate endDate")
    .populate("consultationData.requestServices.serviceId")
    .populate({
      path: "consultationData.requestedRooms.roomId",
      select: "name description area avatar max_people roomTypeId yachtId",
      populate: {
        path: "roomTypeId",
        select: "price",
      },
    })
    .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo mới nhất

  // Tính days/nights cho schedule
  bookings = bookings.map((booking) => {
    const obj = booking.toObject();
    if (obj.schedule && obj.schedule.startDate && obj.schedule.endDate) {
      const start = new Date(obj.schedule.startDate);
      const end = new Date(obj.schedule.endDate);
      const diffMs = end - start;
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      obj.schedule.days = diffDays;
      obj.schedule.nights = diffDays > 0 ? diffDays - 1 : 0;
      obj.schedule.displayText = `${obj.schedule.days} ngày ${obj.schedule.nights} đêm`;
    }
    return obj;
  });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

exports.getCustomerBookingDetail = asyncHandler(async (req, res) => {
  if (!req.user.customerId) {
    return res.status(401).json({
      success: false,
      message: "Không tìm thấy thông tin khách hàng từ token.",
    });
  }
  const { bookingId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(req.params.bookingId)) {
    return res
      .status(400)
      .json({ success: false, message: "Booking ID không hợp lệ." });
  }

  let booking = await BookingOrder.findById(bookingId)
    .populate("yacht", "name image location")
    .populate("schedule", "startDate endDate")
    .populate({ path: "customer", select: "fullName email phoneNumber" })
    .populate("consultationData.requestServices.serviceId")
    .populate({
      path: "consultationData.requestedRooms.roomId",
      select: "name description area avatar max_people roomTypeId yachtId",
      populate: {
        path: "roomTypeId",
        select: "price",
      },
    });

  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking không tồn tại." });
  }

  // Authorization: Customer chỉ xem được booking của mình
  if (booking.customer._id.toString() !== req.user.customerId) {
    return res.status(403).json({
      success: false,
      message: "Không có quyền xem chi tiết booking này.",
    });
  }

  // Lấy thông tin phòng đã đặt
  const bookedRooms = await BookingRoom.find({
    bookingId: booking._id,
  }).populate("roomId");

  // Lấy dịch vụ đã lưu
  const bookedServices = await BookingService.find({
    bookingId: booking._id,
  }).populate("serviceId");

  // Tính days/nights cho schedule
  let bookingObj = booking.toObject();
  if (
    bookingObj.schedule &&
    bookingObj.schedule.startDate &&
    bookingObj.schedule.endDate
  ) {
    const start = new Date(bookingObj.schedule.startDate);
    const end = new Date(bookingObj.schedule.endDate);
    const diffMs = end - start;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    bookingObj.schedule.days = diffDays;
    bookingObj.schedule.nights = diffDays > 0 ? diffDays - 1 : 0;
    bookingObj.schedule.displayText = `${bookingObj.schedule.days} ngày ${bookingObj.schedule.nights} đêm`;
  }

  res.status(200).json({
    success: true,
    data: {
      booking: bookingObj,
      bookedRooms,
      bookedServices,
    },
  });
});

// ==================== UTILITY FUNCTIONS ====================
exports.getRooms = asyncHandler(async (req, res) => {
  const { yachtId, scheduleId, checkInDate, checkOutDate } = req.query;
  try {
    res.status(200).json({
      success: true,
      data: [],
      message: "Lấy danh sách phòng (chức năng cần hoàn thiện logic kiểm tra)",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách phòng",
      error: error.message,
    });
  }
});

exports.updateCustomerInfo = asyncHandler(async (req, res) => {
  const { fullName, phoneNumber, email, address } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const customer = await Customer.findOne({
      accountId: req.user._id,
    }).session(session);
    if (!customer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin khách hàng",
      });
    }

    if (fullName) customer.fullName = fullName;
    if (phoneNumber) customer.phoneNumber = phoneNumber;
    if (email) customer.email = email; // Be cautious with email updates if it's a login identifier
    if (address) customer.address = address;

    const updatedCustomer = await customer.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: updatedCustomer,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật thông tin",
      error: error.message,
    });
  }
});

exports.customerCancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res
      .status(400)
      .json({ success: false, message: "Booking ID không hợp lệ." });
  }
  if (!req.user.customerId) {
    return res.status(401).json({
      success: false,
      message: "Không tìm thấy thông tin khách hàng từ token.",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await BookingOrder.findById(bookingId).session(session);

    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Booking không tồn tại." });
    }

    // Authorization: Customer chỉ hủy được booking của mình
    if (booking.customer.toString() !== req.user.customerId) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền hủy booking này." });
    }

    if (["completed", "cancelled", "rejected"].includes(booking.status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Không thể hủy booking ở trạng thái ${booking.status}.`,
      });
    }
    // Nếu là confirmed, chỉ cho phép hủy trước ngày check-in 1 ngày
    if (booking.status === "confirmed") {
      const now = new Date();
      const checkIn = new Date(booking.checkInDate);
      const oneDayBeforeCheckIn = new Date(
        checkIn.getTime() - 24 * 60 * 60 * 1000
      );
      if (now >= oneDayBeforeCheckIn) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message:
            "Chỉ có thể hủy booking đã xác nhận trước ngày nhận phòng 1 ngày.",
        });
      }
    }

    // DEBUG trạng thái booking trước khi cộng lại phòng
    console.log("DEBUG: Trước khi cộng lại phòng:", {
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      truPhong: booking.truPhong,
      bookingId: booking._id,
    });
    // Cộng lại phòng nếu booking ở trạng thái confirmed hoặc confirmed_deposit và đã từng trừ phòng
    if (
      ["confirmed", "confirmed_deposit"].includes(booking.status) &&
      (booking.paymentStatus === "fully_paid" ||
        booking.paymentStatus === "deposit_paid") &&
      booking.truPhong
    ) {
      const rooms = booking.consultationData?.requestedRooms || [];
      for (const room of rooms) {
        const roomId = room.roomId?._id || room.roomId;
        const qty = room.quantity || 1;
        if (roomId) {
          await Room.findByIdAndUpdate(
            roomId,
            { $inc: { quantity: qty } },
            { session }
          );
          console.log(
            `DEBUG: Cộng lại phòng - roomId: ${roomId}, quantity cộng lại: ${qty}`
          );
        }
      }
      booking.truPhong = false;
      await booking.save({ session });
    }

    booking.status = "cancelled";

    const updatedBooking = await booking.save({ session });

    // Gửi email thông báo hủy booking cho khách hàng
    try {
      // Lấy thông tin du thuyền nếu chưa có
      let yachtName = "";
      if (booking.yacht && booking.yacht.name) {
        yachtName = booking.yacht.name;
      } else {
        // Populate yacht nếu chưa có tên
        const yachtDoc = await mongoose.model("Yacht").findById(booking.yacht);
        yachtName = yachtDoc?.name || "Du thuyền";
      }
      // Lấy thông tin khách hàng
      const email = booking.customerInfo?.email;
      const fullName = booking.customerInfo?.fullName || "Khách hàng";
      const bookingCode = booking.bookingCode || booking._id?.toString();
      const checkInDate = booking.checkInDate
        ? new Date(booking.checkInDate).toLocaleDateString("vi-VN")
        : "-";
      const totalPrice =
        booking.paymentBreakdown?.totalAmount?.toLocaleString("vi-VN") || "-";
      // Lấy số tiền đã đặt cọc nếu có
      let depositAmount = undefined;
      if (
        booking.status === "confirmed_deposit" ||
        booking.paymentBreakdown?.depositAmount > 0
      ) {
        depositAmount =
          booking.paymentBreakdown.depositAmount?.toLocaleString("vi-VN");
      }
      // Gửi mail nếu có email
      if (email) {
        const { sendCancelBookingEmail } = require("../utils/sendMail");
        await sendCancelBookingEmail(
          email,
          fullName,
          bookingCode,
          yachtName,
          checkInDate,
          totalPrice,
          depositAmount
        );
      }
    } catch (mailErr) {
      // Không throw lỗi gửi mail, chỉ log
      console.error("[Booking] Lỗi gửi email hủy booking:", mailErr);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Hủy booking thành công.",
      data: updatedBooking,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "Lỗi server khi hủy booking.",
      error: error.message,
    });
  }
});

// Thêm API lưu dịch vụ tư vấn vào consultationData.requestServices
exports.saveConsultationServices = async (req, res) => {
  try {
    const { bookingOrderId, requestServices } = req.body;
    const booking = await BookingOrder.findByIdAndUpdate(
      bookingOrderId,
      { "consultationData.requestServices": requestServices },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBookingOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res
      .status(400)
      .json({ success: false, message: "Booking ID không hợp lệ." });
  }

  // Chỉ cho phép xóa booking đã huỷ và thuộc về user hiện tại
  const bookingOrder = await BookingOrder.findOne({
    _id: bookingId,
    customer: req.user.customerId,
    status: "cancelled",
  });

  if (!bookingOrder) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy booking đã huỷ hoặc bạn không có quyền.",
    });
  }

  // Xóa các bản ghi liên quan ở BookingRoom và BookingService
  await BookingRoom.deleteMany({ bookingId });
  await BookingService.deleteMany({ bookingId });
  await bookingOrder.deleteOne();

  res.status(200).json({
    success: true,
    message: "Booking đã được xóa thành công.",
  });
});

// Lấy toàn bộ bookingOrder theo idCompany (chỉ cho admin)
exports.getAllBookingOrders = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền truy cập!",
    });
  }
  const { idCompany } = req.query;
  if (!idCompany) {
    return res.status(400).json({
      success: false,
      message: "Thiếu idCompany!",
    });
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  // BookingOrder có thể lưu company dưới trường IdCompanys hoặc companyId hoặc yacht.IdCompanys tuỳ thiết kế
  // Giả sử trường là IdCompanys (nếu khác báo lại)
  filter["IdCompanys"] = idCompany;

  const total = await BookingOrder.countDocuments(filter);
  const data = await BookingOrder.find(filter)
    .populate("customer", "fullName email phoneNumber")
    .populate("yacht", "name")
    .populate("schedule", "startDate endDate")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    total,
    page,
    limit,
    data,
  });
});

// Lấy danh sách bookingOrder của company thông qua bảng Yacht (chỉ cho admin)
exports.getBookingOrdersByCompany = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "COMPANY") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền truy cập!",
    });
  }
  const companyId = req.user.companyId;
  if (!companyId) {
    return res.status(400).json({
      success: false,
      message: "Không tìm thấy thông tin công ty từ token!",
    });
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Lấy tất cả yacht thuộc công ty
  const yachts = await Yacht.find({ IdCompanys: companyId }).select("_id");
  const yachtIds = yachts.map((y) => y._id);

  // Lấy tất cả bookingOrder có yacht thuộc danh sách trên
  const total = await BookingOrder.countDocuments({ yacht: { $in: yachtIds } });
  const data = await BookingOrder.find({ yacht: { $in: yachtIds } })
    .populate("customer", "fullName email phoneNumber")
    .populate("yacht", "name")
    .populate("schedule", "startDate endDate")
    .populate({
      path: "consultationData.requestedRooms.roomId",
      select: "name description area avatar max_people roomTypeId yachtId",
      populate: { path: "roomTypeId", select: "type utility price" },
    })
    .populate({
      path: "schedule",
      populate: {
        path: "scheduleId",
        select: "startDate endDate",
      },
    })
    .populate({
      path: "consultationData.requestServices.serviceId",
      select: "serviceName price",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Đảm bảo mỗi booking đều có _id khi trả về
  const dataWithId = data.map((item) => ({
    _id: item._id,
    ...item.toObject(),
  }));

  res.status(200).json({
    success: true,
    total,
    page,
    limit,
    data: dataWithId,
  });
});

exports.companyCompleteBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res
      .status(400)
      .json({ success: false, message: "Booking ID không hợp lệ." });
  }
  if (!req.user || req.user.role !== "COMPANY") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền xác nhận hoàn thành booking này.",
    });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await BookingOrder.findById(bookingId).session(session);
    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Booking không tồn tại." });
    }
    // Chỉ cho phép hoàn thành nếu đã fully_paid và status là confirmed hoặc confirmed_deposit
    if (
      booking.paymentStatus !== "fully_paid" ||
      !["confirmed", "confirmed_deposit"].includes(booking.status)
    ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message:
          "Booking chưa đủ điều kiện để hoàn thành (phải đã thanh toán đủ và đã xác nhận).",
      });
    }
    booking.status = "completed";
    await booking.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      success: true,
      message: "Booking đã được xác nhận hoàn thành.",
      data: booking,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xác nhận hoàn thành booking.",
      error: error.message,
    });
  }
});

exports.companyCancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res
      .status(400)
      .json({ success: false, message: "Booking ID không hợp lệ." });
  }
  if (!req.user || req.user.role !== "COMPANY") {
    return res
      .status(403)
      .json({ success: false, message: "Bạn không có quyền huỷ booking này." });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await BookingOrder.findById(bookingId).session(session);
    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Booking không tồn tại." });
    }
    // Bỏ điều kiện chỉ cho phép huỷ sau thời gian check-in
    // Chỉ không cho huỷ nếu đã completed/cancelled/rejected
    if (["completed", "cancelled", "rejected"].includes(booking.status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Không thể huỷ booking ở trạng thái ${booking.status}.`,
      });
    }
    booking.status = "rejected";
    await booking.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      success: true,
      message: "Booking đã được huỷ bởi company (rejected).",
      data: booking,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "Lỗi server khi huỷ booking.",
      error: error.message,
    });
  }
});

exports.confirmFullPayment = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res
      .status(400)
      .json({ success: false, message: "Booking ID không hợp lệ." });
  }
  // Có thể kiểm tra quyền ở đây nếu cần (admin, thu ngân, ...)
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await BookingOrder.findById(bookingId).session(session);
    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Booking không tồn tại." });
    }
    if (
      booking.status !== "confirmed_deposit" ||
      booking.paymentStatus !== "deposit_paid"
    ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Chỉ xác nhận khi booking đang ở trạng thái đặt cọc.",
      });
    }
    booking.paymentStatus = "fully_paid";
    booking.status = "confirmed";
    booking.paymentBreakdown.totalPaid = booking.paymentBreakdown.totalAmount;
    booking.paymentBreakdown.remainingAmount = 0;
    await booking.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      success: true,
      message: "Đã xác nhận thanh toán đủ, booking chuyển sang confirmed.",
      data: booking,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xác nhận thanh toán đủ.",
      error: error.message,
    });
    console.error("Error confirming full payment:", error);
  }
});

// Đổi lịch booking cho company
exports.changeSchedule = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { newYachtId, newStartDate, newEndDate } = req.body;
    const booking = await mongoose.model("BookingOrder").findById(bookingId);
    if (!booking)
      return res.status(404).json({ message: "Không tìm thấy booking" });

    // Kiểm tra quyền: chỉ company sở hữu thuyền mới được đổi
    const yacht = await mongoose
      .model("Yacht")
      .findById(newYachtId || booking.yacht);
    if (!yacht)
      return res.status(404).json({ message: "Không tìm thấy thuyền" });
    if (req.companyId && yacht.IdCompanys.toString() !== req.companyId) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền đổi lịch thuyền này" });
    }

    // Kiểm tra trùng lịch
    const BookingOrder = mongoose.model("BookingOrder");
    const isSlotAvailable = await BookingOrder.findOne({
      yacht: newYachtId || booking.yacht,
      _id: { $ne: bookingId },
      $or: [
        { checkInDate: { $lt: newEndDate, $gte: newStartDate } },
        { checkOutDate: { $gt: newStartDate, $lte: newEndDate } },
        {
          checkInDate: { $lte: newStartDate },
          checkOutDate: { $gte: newEndDate },
        },
      ],
      status: "confirmed",
    });
    if (isSlotAvailable) {
      return res.status(400).json({ message: "Lịch đã bị trùng!" });
    }

    // Cập nhật booking
    booking.yacht = newYachtId || booking.yacht;
    booking.checkInDate = newStartDate;
    booking.checkOutDate = newEndDate;
    await booking.save();

    // Cập nhật invoice nếu cần (giả sử có trường invoiceId trong booking)
    if (booking.invoiceId) {
      const Invoice = mongoose.model("Invoice");
      // Tính lại tổng tiền nếu cần, ví dụ dựa vào thời gian mới
      // (Bạn có thể bổ sung logic tính giá ở đây)
      // const newTotal = ...
      // await Invoice.findByIdAndUpdate(booking.invoiceId, { total: newTotal });
    }

    res.json({ message: "Đổi lịch thành công", booking });
  } catch (err) {
    res.status(500).json({ message: "Lỗi đổi lịch", error: err.message });
  }
};

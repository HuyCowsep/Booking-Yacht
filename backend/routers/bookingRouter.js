// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();

const bookingController = require("../controller/bookingController");
const {
  createBookingOrConsultationRequest,
  getCustomerBookings,
  getCustomerBookingDetail,
  customerCancelBooking,
  getRooms,
  updateCustomerInfo,
  customerConfirmBookingAfterConsultation,
  getConsultationRequest,
  updateBookingOrConsultationRequest,
  cancelConsultationRequest,
  deleteBookingOrder,
  companyCompleteBooking,
  companyCancelBooking,
  confirmFullPayment,
  confirmBooking,
} = bookingController;
const { veryfiToken, authenticate, isCompany } = require("../middleware/authMiddleware");
const { testSendMail } = require("../utils/sendMail");

// ==================== BOOKING CREATION & CONSULTATION ====================
router.post("/request", veryfiToken, createBookingOrConsultationRequest);
router.put(
  "/request/:bookingId",
  veryfiToken,
  updateBookingOrConsultationRequest
);
router.post(
  "/:bookingId/confirm-consultation",
  veryfiToken,
  customerConfirmBookingAfterConsultation
);
router.get("/consultation", veryfiToken, getConsultationRequest);
router.delete(
  "/consultation/:bookingId",
  veryfiToken,
  cancelConsultationRequest
);
router.get("/my-bookings", veryfiToken, getCustomerBookings);
router.get("/:bookingId/my-detail", veryfiToken, getCustomerBookingDetail);
router.put("/:bookingId/cancel", veryfiToken, customerCancelBooking);
router.get("/available-rooms", getRooms);
router.put("/customer/my-info", veryfiToken, updateCustomerInfo);
router.delete("/:bookingId", veryfiToken, deleteBookingOrder);
router.put("/company/:bookingId/complete", veryfiToken, companyCompleteBooking);
router.put("/company/:bookingId/cancel", veryfiToken, companyCancelBooking);
router.put("/:bookingId/confirm-full-payment", confirmFullPayment);
router.post("/:bookingId/confirm", veryfiToken, confirmBooking);
// Route test gửi email
router.get("/test-send-mail", async (req, res) => {
  const { to } = req.query;
  try {
    const info = await testSendMail(to);
    res.json({ success: true, message: "Đã gửi email test thành công!", info });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Đổi lịch booking cho company
router.put('/company/bookings/:bookingId/change-schedule', authenticate, isCompany, bookingController.changeSchedule);

// Lấy toàn bộ bookingOrder (chỉ cho admin)
router.get("/all", veryfiToken, bookingController.getAllBookingOrders);

// Lấy danh sách bookingOrder của company (chỉ cho admin)
router.get("/company", veryfiToken ,bookingController.getBookingOrdersByCompany);

// Thêm route lưu dịch vụ tư vấn vào consultationData.requestServices
router.post(
  "/consultation-services",
  veryfiToken,
  bookingController.saveConsultationServices
);

module.exports = router;

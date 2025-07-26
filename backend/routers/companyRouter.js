const express = require("express");
const router = express.Router();

const {
  getAllCompany,
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  countCompanies,
  getRevenueBooking,
  getRevenueService,
  getMonthlyRevenue,
  exportBooking,
  getInfoCompany,
  loginCompany,
  getBookingByYear,
  getTotalBookingStats,
  updateProfileCompany,
} = require("../controller/companyController");
const { upload } = require("../utils/configClound");
const { veryfiToken } = require("../middleware/authMiddleware");

// CRUD COMPANY
router.post("/", createCompany); // Tạo công ty
router.get("/", getAllCompany); // Lấy company có exist = 1 (cho FE hiển thị)
router.get("/all", getAllCompanies); // Lấy tất cả (cả exist = 0)
router.put("/:id", veryfiToken, updateCompany); // Cập nhật
router.put("/profile/:id", veryfiToken, upload.single("logo"), updateProfileCompany); // ✅ Company tự update profile (có thể có ảnh)
router.delete("/:id", veryfiToken, deleteCompany); // Xoá
router.get("/count", veryfiToken, countCompanies); // Đếm tổng

// DOANH THU
router.get("/revenue/booking", getRevenueBooking); // Doanh thu từ booking
router.get("/revenue/service", getRevenueService); // Doanh thu từ dịch vụ
router.get("/revenue/monthly", veryfiToken, getMonthlyRevenue); // Tổng hợp từng tháng
router.get("/booking-by-year", getBookingByYear);
router.get("/total-booking-stats", getTotalBookingStats);

// EXPORT FILE
router.get("/export/:idCompany", veryfiToken, exportBooking); // Xuất file Excel

router.get("/info/:id", veryfiToken, getInfoCompany); // Lấy thông tin công ty theo ID
router.post("/login", loginCompany);

module.exports = router;

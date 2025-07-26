const express = require("express");
const { getDashboardStats, adminLogin, getAdminProfile, changeAdminPassword } = require("../controller/adminController");
const { verifyAdminToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Route lấy thống kê dashboard
router.get("/stats", verifyAdminToken, getDashboardStats);
router.post("/login", adminLogin);

router.get("/profile", verifyAdminToken, getAdminProfile);
router.post("/change-password", verifyAdminToken, changeAdminPassword);

module.exports = router;
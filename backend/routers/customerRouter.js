const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  googleLogin,
  updateCustomer,
  uploadCustomerAvatar,
  changePassword,
} = require("../controller/customerController");
const { veryfiToken } = require("../middleware/authMiddleware");
const uploadAvatar = require("../utils/customerUpload");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword); //cần otp
router.post("/verify-otp", verifyOtp); //cần otp
router.post("/reset-password", resetPassword); //cần otp
router.post("/google-login", googleLogin);
router.post("/change-password", veryfiToken, changePassword); //không cần otp, vì đã login

router.put("/:id", updateCustomer);
router.put("/:id/avatar", uploadAvatar.single("avatar"), uploadCustomerAvatar);

module.exports = router;

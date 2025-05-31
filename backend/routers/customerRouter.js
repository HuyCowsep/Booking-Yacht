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

const uploadAvatar = require("../utils/customerUpload");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/google-login", googleLogin);
router.post("/change-password", changePassword);

router.put("/:id", updateCustomer);
router.put("/:id/avatar", uploadAvatar.single("avatar"), uploadCustomerAvatar);

module.exports = router;
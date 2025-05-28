const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, verifyOtp, resetPassword, googleLogin } = require('../controller/customerController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post("/google-login", googleLogin);

module.exports = router;
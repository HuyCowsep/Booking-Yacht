// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createDepositPayment,
  createFullPayment,
  handleVnpayReturn,
  handleVnpayIpn,
  handleMomoReturn,
  handleMomoIpn,
  getTransactionStatus,
  simulatePaymentSuccess,
  cancelTransaction,
  getPendingTransactionForBooking,
} = require("../controller/paymentController");
const { veryfiToken } = require("../middleware/authMiddleware");

// Check if all imported functions exist
console.log("Imported functions:", {
  createDepositPayment: typeof createDepositPayment,
  createFullPayment: typeof createFullPayment,
  handleVnpayReturn: typeof handleVnpayReturn,
  handleVnpayIpn: typeof handleVnpayIpn,
  handleMomoReturn: typeof handleMomoReturn,
  handleMomoIpn: typeof handleMomoIpn,
  getTransactionStatus: typeof getTransactionStatus,
  simulatePaymentSuccess: typeof simulatePaymentSuccess,
  cancelTransaction: typeof cancelTransaction,
  getPendingTransactionForBooking: typeof getPendingTransactionForBooking,
});

// Only add routes if the handler functions exist
if (createDepositPayment) {
  router.post("/deposit", veryfiToken, createDepositPayment);
} else {
  console.error("createDepositPayment function is undefined");
}

if (createFullPayment) {
  router.post("/full", veryfiToken, createFullPayment);
} else {
  console.error("createFullPayment function is undefined");
}

if (handleVnpayReturn) {
  router.get("/vnpay_return", handleVnpayReturn);
} else {
  console.error("handleVnpayReturn function is undefined");
}

if (handleVnpayIpn) {
  router.get("/vnpay_ipn", handleVnpayIpn);
} else {
  console.error("handleVnpayIpn function is undefined");
}

if (handleMomoReturn) {
  router.get("/momo_return", handleMomoReturn);
} else {
  console.error("handleMomoReturn function is undefined");
}

if (handleMomoIpn) {
  router.post("/momo_ipn", handleMomoIpn);
} else {
  console.error("handleMomoIpn function is undefined");
}

if (getTransactionStatus) {
  router.get(
    "/transaction/:transactionId/status",
    veryfiToken,
    getTransactionStatus
  );
} else {
  console.error("getTransactionStatus function is undefined");
}

if (simulatePaymentSuccess) {
  router.post(
    "/transaction/:transactionId/simulate",
    veryfiToken,
    simulatePaymentSuccess
  );
} else {
  console.error("simulatePaymentSuccess function is undefined");
}

if (cancelTransaction) {
  router.post(
    "/transaction/:transactionId/cancel",
    veryfiToken,
    cancelTransaction
  );
}

if (getPendingTransactionForBooking) {
  router.get(
    "/booking/:bookingId/pending-transaction",
    veryfiToken,
    getPendingTransactionForBooking
  );
}

module.exports = router;

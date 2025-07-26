// models/transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookingOrder",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  transaction_type: {
    type: String,
    enum: [
      "deposit",
      "partial_payment",
      "final_payment",
      "full_payment",
      "refund",
    ],
    required: true,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "processing",
      "completed",
      "failed",
      "cancelled",
      "expired",
    ],
    default: "pending",
  },
  payment_method: {
    type: String,
    enum: ["vnpay", "momo", "bank_transfer", "cash", "card", "unknown"],
    required: true,
  },
  transaction_reference: {
    type: String,
    unique: true,
    index: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  expiredAt: Date,
  gateway_response: {
    type: Object,
    default: {},
  },
});

// Generate transaction reference
transactionSchema.pre("save", function (next) {
  if (!this.transaction_reference) {
    const prefix = this.payment_method
      ? this.payment_method.toUpperCase().substring(0, 3)
      : "TRN";
    const timestamp = Date.now().toString(); // Sử dụng timestamp đầy đủ hơn
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.transaction_reference = `${prefix}${timestamp.slice(-8)}${random}`;
  }

  // Set expiration cho QR codes (15 phút)
  if (
    !this.expiredAt &&
    (this.payment_method === "vnpay" || this.payment_method === "momo") &&
    this.status === "pending"
  ) {
    this.expiredAt = new Date(Date.now() + 15 * 60 * 1000);
  }

  // Set expiration cho bank transfer (24 giờ)
  if (
    !this.expiredAt &&
    this.payment_method === "bank_transfer" &&
    this.status === "pending"
  ) {
    this.expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  next();
});

// Virtual fields
transactionSchema.virtual("formattedAmount").get(function () {
  return this.amount?.toLocaleString("vi-VN") + " VNĐ";
});

transactionSchema.virtual("isExpired").get(function () {
  return this.expiredAt && new Date() > this.expiredAt;
});

transactionSchema.virtual("statusDisplay").get(function () {
  const statusMap = {
    pending: "Đang chờ",
    processing: "Đang xử lý",
    completed: "Hoàn thành",
    failed: "Thất bại",
    cancelled: "Đã hủy",
    expired: "Hết hạn",
  };
  return statusMap[this.status] || this.status;
});

module.exports = mongoose.model("Transaction", transactionSchema);

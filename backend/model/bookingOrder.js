// models/bookingOrder.js
const mongoose = require("mongoose");

const bookingOrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    customerInfo: {
      fullName: String,
      email: String,
      phoneNumber: String,
      address: String,
    },
    yacht: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Yacht",
      required: true,
    },
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "YachtSchedule",
      default: null,
    },
    status: {
      type: String,
      enum: [
        "consultation_requested",
        "pending_payment",
        "confirmed",
        "completed",
        "confirmed_deposit",
        "cancelled",
        "rejected",
        "confirmed_deposit",
      ],
      default: "consultation_requested",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "deposit_paid", "fully_paid"],
      default: "unpaid",
    },
    paymentBreakdown: {
      totalAmount: { type: Number, default: 0 },
      depositAmount: { type: Number, default: 0 },
      depositPercentage: { type: Number, default: 20 },
      remainingAmount: { type: Number, default: 0 },
      totalPaid: { type: Number, default: 0 },
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },
    adults: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    childrenUnder10: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    childrenAbove10: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    consultationData: {
      requestedRooms: [
        {
          roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
          quantity: { type: Number, default: 1 },
          _id: false,
        },
      ],
      requestServices: [
        {
          serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
          quantity: { type: Number, default: 1 },
          _id: false,
        },
      ],
      estimatedPrice: { type: Number, default: 0 },
      requirements: {
        type: String,
        default: "",
      },
    },
    truPhong: { type: Boolean, default: false },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    bookingCode: {
      type: String,
      sparse: true,
    },
    confirmationCode: {
      type: String,
      sparse: true,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware để tạo codes và tính toán
bookingOrderSchema.pre("save", function (next) {
  // Nếu chưa có checkInDate, lấy từ startDate (nếu có)
  if (!this.checkInDate && this.startDate) {
    this.checkInDate = this.startDate;
  }
  // Tạo booking code nếu chưa có
  if (!this.bookingCode) {
    const prefix = "BK";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.bookingCode = `${prefix}${timestamp}${random}`;
  }
  if (
    this.isModified("status") &&
    ["confirmed", "confirmed_deposit"].includes(this.status) &&
    !this.confirmationCode
  ) {
    this.confirmationCode =
      "CNF" +
      Date.now().toString().slice(-8) +
      Math.random().toString(36).substr(2, 4).toUpperCase();
    if (!this.confirmedAt) {
      // Chỉ set nếu chưa có
      this.confirmedAt = new Date();
    }
  }

  // Tính toán payment breakdown
  const total = this.paymentBreakdown.totalAmount || 0;
  this.paymentBreakdown.depositAmount = Math.round(
    (total * this.paymentBreakdown.depositPercentage) / 100
  );
  this.paymentBreakdown.remainingAmount =
    total - (this.paymentBreakdown.totalPaid || 0);

  // Set timestamps dựa trên thay đổi trạng thái
  if (this.isModified("status")) {
    if (this.status === "pending_payment" && !this.paymentPendingAt) {
      this.paymentPendingAt = new Date();
    }
    if (this.status === "cancelled" && !this.cancelledAt) {
      this.cancelledAt = new Date();
    }
  }

  if (this.isModified("consultationStatus")) {
    if (
      this.consultationStatus === "requested" &&
      !this.consultationRequestedAt
    ) {
      this.consultationRequestedAt = new Date();
    }
    if (this.consultationStatus === "sent" && !this.consultationSentAt) {
      this.consultationSentAt = new Date();
    }
  }
  next();
});

// Virtual fields
bookingOrderSchema.virtual("canModify").get(function () {
  return (
    this.allowModifications &&
    this.modificationDeadline &&
    new Date() < this.modificationDeadline &&
    ["confirmed"].includes(this.status)
  );
});

bookingOrderSchema.virtual("formattedAmount").get(function () {
  return this.amount?.toLocaleString("vi-VN") + " VNĐ";
});

module.exports = mongoose.model(
  "BookingOrder",
  bookingOrderSchema,
  "bookingOrders"
);

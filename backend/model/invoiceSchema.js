const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookingOrder",
    required: true,
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  yachtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Yacht",
  },
  items: [
    {
      type: {
        type: String,
        enum: ["room", "service", "extra", "fee", "discount"],
        required: true,
      },
      itemId: mongoose.Schema.Types.ObjectId,
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      totalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  financials: {
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  status: {
    type: String,
    enum: ["draft", "issued", "paid", "partially_paid", "overdue", "cancelled"],
    default: "issued",
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "partial", "paid", "refunded"],
    default: "unpaid",
  },
  currency: {
    type: String,
    default: "VND",
  },
});

// Generate invoice number and due date before validation
invoiceSchema.pre("validate", function (next) {
  if (!this.issueDate) {
    this.issueDate = new Date();
  }
  if (!this.invoiceNumber) {
    const date = new Date(this.issueDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const timestamp = Date.now().toString().slice(-6);
    this.invoiceNumber = `INV${year}${month}${day}${timestamp}`;
  }
  if (!this.dueDate) {
    this.dueDate = new Date(
      this.issueDate.getTime() + 30 * 24 * 60 * 60 * 1000
    );
  }
  next();
});

// Calculate financials before saving
invoiceSchema.pre("save", function (next) {
  // Calculate subtotal and taxes
  this.financials.subtotal = this.items.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  this.financials.total = this.financials.subtotal;

  // Calculate remaining amount
  this.financials.remainingAmount =
    this.financials.total - this.financials.paidAmount;

  // Update payment status
  if (this.financials.paidAmount >= this.financials.total) {
    this.paymentStatus = "paid";
    this.status = "paid";
  } else if (this.financials.paidAmount > 0) {
    this.paymentStatus = "partial";
    this.status = "partially_paid";
  } else {
    this.paymentStatus = "unpaid";
    if (this.dueDate && new Date() > this.dueDate) {
      this.status = "overdue";
    }
  }

  next();
});

// Virtual fields
invoiceSchema.virtual("formattedTotal").get(function () {
  return this.financials.total?.toLocaleString("vi-VN") + " VNĐ";
});

invoiceSchema.virtual("isOverdue").get(function () {
  return (
    this.dueDate && new Date() > this.dueDate && this.paymentStatus !== "paid"
  );
});

// Methods
invoiceSchema.methods.addAuditEntry = function (
  action,
  performedBy,
  details,
  ipAddress
) {
  this.auditTrail.push({
    action,
    performedBy,
    details,
    ipAddress,
    performedAt: new Date(),
  });
};

invoiceSchema.methods.markAsSent = function (email) {
  this.emailTracking.push({
    sentAt: new Date(),
    sentTo: email,
    subject: `Hóa đơn ${this.invoiceNumber}`,
  });
};

module.exports = mongoose.model("Invoice", invoiceSchema);

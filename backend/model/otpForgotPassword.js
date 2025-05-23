const mongoose = require("mongoose");
const { Schema } = mongoose;

const otpForgotPasswordSchema = new Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  token: String,
  expiredAt: Date,
  used: { type: Boolean, default: false },
});

module.exports = mongoose.model("OtpForgotPassword", otpForgotPasswordSchema, "otpForgotPassword");

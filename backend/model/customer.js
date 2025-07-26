const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema({
  fullName: String,
  phoneNumber: { type: String, default: "" }, // Thêm default là "" để phục vụ cho login bằng google
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: null },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", unique: true, required: false },
  googleId: { type: String, unique: true, sparse: true },
});

module.exports = mongoose.model("Customer", customerSchema, "customers");

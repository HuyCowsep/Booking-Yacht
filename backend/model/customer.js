const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema({
  fullName: String,
  phoneNumber: String,
  email: String,
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", unique: true, required: true },
  googleId: { type: String, unique: true, sparse: true },
});

module.exports = mongoose.model("Customer", customerSchema, "customers");

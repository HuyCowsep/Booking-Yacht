const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    fullName: String,
    phoneNumber: String,
    address: String,
    email: String,
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true, unique: true },
  }
);

module.exports = mongoose.model("Customer", customerSchema, "customers");
//done
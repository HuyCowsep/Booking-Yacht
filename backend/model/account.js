const mongoose = require("mongoose");
const { Schema } = mongoose;

const accountSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
      type: String,
      enum: ["ADMIN", "CUSTOMER", "COMPANY"],
      required: true,
    },
    status: { type: Number, default: 1 },
  }
);

module.exports = mongoose.model("Account", accountSchema, "accounts");
//done
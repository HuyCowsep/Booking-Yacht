const mongoose = require("mongoose");
const { Schema } = mongoose;

const companySchema = new Schema(
  {
    name: String,
    address: String,
    logo: String,
    email: String,
    exist: { type: Number, default: 1 },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true, unique: true },
  }
);

module.exports = mongoose.model("Company", companySchema, "companies");
//done
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: {
    type: String,
    enum: ["ADMIN", "CUSTOMER", "COMPANY"],
    required: true,
  },
  status: { type: Number, default: 1 },
});

accountSchema.pre("save", async function (next) {
  try {
    // Chỉ hash nếu password chưa được hash (kiểm tra bằng cách xem chuỗi có bắt đầu bằng $2a$, $2b$, v.v.)
    if (this.isModified("password") && this.password && !this.password.startsWith("$2")) {
      this.password = await bcryptjs.hash(this.password, 10);
    }
    next();
  } catch (error) {
    next(error);
  }
});

accountSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

module.exports = mongoose.model("Account", accountSchema, "accounts");

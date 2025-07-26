const Customer = require("../model/customer");
const Account = require("../model/account");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const { sendOTP } = require("../utils/sendMail");

exports.getDashboardStats = async (req, res) => {
  try {
    const customerCount = await Customer.countDocuments(); // Đếm tất cả customer
    res.json({
      customer: customerCount,
      earnings: 30200,
      customer1: 245,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// hàm đăng nhập admin
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Hãy điền tên đăng nhập và mật khẩu",
      });
    }

    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(400).json({
        message: "Tên đăng nhập hoặc mật khẩu không đúng",
      });
    }

    if (account.roles !== "ADMIN") {
      return res.status(403).json({
        message: "Tài khoản không có quyền truy cập trang quản trị",
      });
    }

    const isMatch = await bcryptjs.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Tên đăng nhập hoặc mật khẩu không đúng",
      });
    }

    const token = jwt.sign({ _id: account._id, role: account.roles }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Đăng nhập admin thành công",
      token,
      admin: {
        id: account._id,
        username: account.username,
        role: account.roles,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi đăng nhập admin:", error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập admin" });
  }
};

// Hàm Lấy profile admin
exports.getAdminProfile = async (req, res) => {
  try {
    const account = await Account.findById(req.user._id).select('username roles status');
    if (!account) {
      return res.status(404).json({ message: "Không tìm thấy admin" });
    }
    res.json({
      username: account.username,
      roles: account.roles,
      status: account.status === 1 ? 'Đang hoạt động' : 'Dừng hoạt động' // Convert status thành string dễ hiểu
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy profile admin:", error);
    res.status(500).json({ message: "Lỗi server khi lấy profile" });
  }
};

// Hàm Thay đổi mật khẩu admin
exports.changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Hãy điền mật khẩu cũ và mới" });
    }

    const account = await Account.findById(req.user._id);
    if (!account) {
      return res.status(404).json({ message: "Không tìm thấy admin" });
    }

    const isMatch = await bcryptjs.compare(oldPassword, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    // Hash mật khẩu mới
    account.password = await bcryptjs.hash(newPassword, 10);
    await account.save();

    res.json({ message: "Thay đổi mật khẩu thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi thay đổi mật khẩu admin:", error);
    res.status(500).json({ message: "Lỗi server khi thay đổi mật khẩu" });
  }
};
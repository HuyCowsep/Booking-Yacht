const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Customer, Company, Account } = require("../model");

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();

    if (!accounts) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản nào" });
    }
    res.status(200).json({
      message: "Lấy danh sách tài khoản thành công",
      data: accounts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập tên đăng nhập và mật khẩu" });
    }
    const account = await Account.findOne({ username });
    if (!account) {
      return res
        .status(400)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }
    const isMatch = await bcryptjs.compare(password, account.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }
    let idCustomer = null;
    let idCompany = null;
    let customer = null;
    if (account.roles === "CUSTOMER") {
      customer = await Customer.findOne({ accountId: account._id });
      if (customer) idCustomer = customer._id;
    } else if (account.roles === "COMPANY") {
      const company = await Company.findOne({ accountId: account._id });
      if (company) idCompany = company._id;
    }
    const token = jwt.sign(
      { _id: account._id, role: account.roles },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      success: true,
      data: {
        message: "Đăng nhập thành công",
        token,
        idAccount: account._id,
        idCompany: idCompany, // Thêm dòng này để trả về idCompany nếu có
        customer, // trả về luôn object customer
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};

module.exports = {
  getAllAccounts,
  login,
};

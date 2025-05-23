const { Account } = require('../model');

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

module.exports = {
  getAllAccounts,
};

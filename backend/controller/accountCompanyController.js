const Company = require("../model/company");
const Account = require("../model/account");
const BookingOrder = require("../model/bookingOrder");
const { sendCompanyRegisterEmail } = require("../utils/sendMail"); // Thêm dòng này ở đầu file

exports.createCompany = async (req, res) => {
  s;
  try {
    // 1. Tạo account cho công ty
    const { username, password, name, address, email } = req.body;
    const account = new Account({
      username,
      password,
      roles: "COMPANY",
      status: 1,
    });
    await account.save();

    // 2. Tạo company, gắn accountId
    const company = new Company({
      name,
      address,
      email,
      accountId: account._id,
    });
    await company.save();

    // 3. Gửi email thông báo tài khoản mới
    await sendCompanyRegisterEmail(email, name, username, password);

    res.status(201).json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("accountId");
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.countCompanies = async (req, res) => {
  try {
    const count = await Company.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ error: "Company not found" });

    // Xóa luôn account liên kết nếu muốn
    if (company.accountId) {
      await Account.findByIdAndDelete(company.accountId);
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { name, address, email, username } = req.body;
    // Cập nhật company
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: "Company not found" });

    company.name = name;
    company.address = address;
    company.email = email;
    await company.save();

    // Nếu có username, cập nhật luôn account liên kết
    if (username && company.accountId) {
      await Account.findByIdAndUpdate(company.accountId, { username });
    }

    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Doanh thu từng tháng, từng năm (cho lọc theo năm ở FE)
exports.getMonthlyRevenue = async (req, res) => {
  try {
    // Lấy tổng doanh thu từng tháng, từng năm từ bảng bookingOrders
    const result = await BookingOrder.aggregate([
      {
        $match: {
          // Chỉ lấy các booking có trạng thái phù hợp để tính doanh thu
          status: { $in: ["confirmed", "completed"] },
          // Đảm bảo có create_time
          create_time: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$create_time" },
            month: { $month: "$create_time" },
          },
          earnings: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": 1 } },
    ]);
    // Chuyển sang dạng { year, month, earnings }
    const monthNames = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const data = result.map((item) => ({
      year: item._id.year,
      month: monthNames[item._id.month],
      earnings: item.earnings,
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

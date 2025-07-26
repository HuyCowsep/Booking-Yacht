const { Company, Account, BookingOrder, YachtSchema, Schedule, BookingService, Service } = require("../model");
const { sendCompanyRegisterEmail } = require("../utils/sendMail");
const ExcelJS = require("exceljs");

// ========== CRUD Company ==========

// Tạo công ty mới + account đi kèm
const createCompany = async (req, res) => {
  try {
    const { username, password, name, address, email } = req.body;

    const account = new Account({
      username,
      password,
      roles: "COMPANY",
      status: 1,
    });
    await account.save();

    const company = new Company({
      name,
      address,
      email,
      accountId: account._id,
    });
    await company.save();

    await sendCompanyRegisterEmail(email, name, username, password);

    res.status(201).json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Cập nhật thông tin công ty
const updateCompany = async (req, res) => {
  try {
    const { name, address, email, username } = req.body;
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: "Company not found" });

    company.name = name;
    company.address = address;
    company.email = email;
    await company.save();

    if (username && company.accountId) {
      await Account.findByIdAndUpdate(company.accountId, { username });
    }

    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa công ty + account liên kết
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ error: "Company not found" });

    if (company.accountId) {
      await Account.findByIdAndDelete(company.accountId);
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả công ty (không filter)
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("accountId");
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy các công ty có `exist = 1`
const getAllCompany = async (req, res) => {
  try {
    const companies = await Company.find().populate("accountId", "-_id username roles status").where("exist").equals(1);

    res.status(200).json({
      success: true,
      message: "Tất cả danh sách du thuyền.",
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách công ty.",
    });
  }
};

// Đếm số công ty
const countCompanies = async (req, res) => {
  try {
    const count = await Company.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========== DOANH THU ==========

// Doanh thu theo tháng/năm từ bookingOrder
const getRevenueBooking = async (req, res) => {
  try {
    const { idCompany, month, year } = req.query;
    const now = new Date();
    const selectedMonth = month || (now.getMonth() + 1).toString();
    const selectedYear = year || now.getFullYear().toString();

    const startDate = new Date(`${selectedYear}-${selectedMonth}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Lấy tất cả yacht thuộc công ty
    const yachts = await YachtSchema.find({ IdCompanys: idCompany }).select("_id");
    const yachtIds = yachts.map((y) => y._id);

    // Lấy booking theo yachtIds
    const bookings = await BookingOrder.find({
      yacht: { $in: yachtIds },
      createdAt: { $gte: startDate, $lt: endDate },
    });

    let total = 0;
    bookings.forEach((order) => {
      const totalAmount = order.paymentBreakdown?.totalAmount || 0;
      if (order.status === "cancelled") {
        if (order.paymentBreakdown && order.paymentBreakdown.depositAmount) {
          total += order.paymentBreakdown.depositAmount;
        } else if (totalAmount) {
          total += Math.round(totalAmount * 0.2);
        }
      } else {
        total += totalAmount;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        revenue: Math.round(total),
      },
    });
  } catch (error) {
    console.error("Error getting revenue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Doanh thu từ dịch vụ
const getRevenueService = async (req, res) => {
  try {
    const { idCompany, month, year } = req.query;

    const now = new Date();
    const selectedMonth = parseInt(month || now.getMonth() + 1);
    const selectedYear = parseInt(year || now.getFullYear());

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 1);

    // 1. Lấy tất cả yacht thuộc công ty
    const yachts = await YachtSchema.find({ IdCompanys: idCompany }).select("_id");
    const yachtIds = yachts.map((y) => y._id);
    // 2. Lấy tất cả booking của các yacht đó trong khoảng thời gian
    const bookings = await BookingOrder.find({
      yacht: { $in: yachtIds },
      createdAt: { $gte: startDate, $lt: endDate },
    });

    let totalServiceRevenue = 0;
    const servicePriceCache = {}; // Cache để không phải query lại giá

    // 3. Lặp qua các booking để tính tổng doanh thu dịch vụ
    for (const booking of bookings) {
      if (booking.consultationData && Array.isArray(booking.consultationData.requestServices)) {
        for (const serviceRequest of booking.consultationData.requestServices) {
          const serviceId = serviceRequest.serviceId;
          const quantity = serviceRequest.quantity || 1;
          if (serviceId) {
            let price = 0;
            // Kiểm tra cache trước khi query
            if (servicePriceCache[serviceId]) {
              price = servicePriceCache[serviceId];
            } else {
              // Nếu chưa có, query và lưu vào cache
              const service = await Service.findById(serviceId);
              if (service && service.price) {
                price = service.price;
                servicePriceCache[serviceId] = price;
              }
            }
            totalServiceRevenue += price * quantity;
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        revenueService: Math.round(totalServiceRevenue),
      },
    });
  } catch (error) {
    console.error("Error getting revenue from service:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Doanh thu tổng hợp theo từng tháng + năm (FE dùng để vẽ biểu đồ)
const getMonthlyRevenue = async (req, res) => {
  try {
    const result = await BookingOrder.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$bookingDate" },
            month: { $month: "$bookingDate" },
          },
          earnings: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": 1 } },
    ]);

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

// ========== EXPORT BOOKING EXCEL ==========

async function getBookings(idCompany, month, year) {
  const m = month || new Date().getMonth() + 1;
  const y = year || new Date().getFullYear();

  const startDate = new Date(y, m - 1, 1);
  const endDate = new Date(y, m, 1);

  // Lấy tất cả yacht thuộc công ty
  const yachts = await YachtSchema.find({ IdCompanys: idCompany }).select("_id");
  const yachtIds = yachts.map((y) => y._id);

  // Ưu tiên dùng createdAt nếu bookingDate không có dữ liệu
  let bookings = await BookingOrder.find({
    yacht: { $in: yachtIds },
    $or: [
      { bookingDate: { $gte: startDate, $lt: endDate } },
      { createdAt: { $gte: startDate, $lt: endDate } }
    ]
  })
    .populate("customerId")
    .populate("scheduleId")
    .exec();

  // Nếu không có booking nào, thử lại chỉ với createdAt
  if (!bookings || bookings.length === 0) {
    bookings = await BookingOrder.find({
      yacht: { $in: yachtIds },
      createdAt: { $gte: startDate, $lt: endDate }
    })
      .populate("customerId")
      .populate("scheduleId")
      .exec();
  }

  // Xử lý logic: nếu booking huỷ, amount = 0, deposit = tiền cọc
  return bookings.map((order) => {
    const totalAmount = order.paymentBreakdown?.totalAmount || 0;
    let deposit = 0;
    if (order.paymentBreakdown && order.paymentBreakdown.depositAmount) {
      deposit = order.paymentBreakdown.depositAmount;
    } else if (totalAmount) {
      deposit = Math.round(totalAmount * 0.2);
    }
    if (order.status === "cancelled") {
      return { ...order.toObject(), amount: 0, deposit };
    }
    return { ...order.toObject(), amount: totalAmount, deposit };
  });
}

const exportBooking = async (req, res) => {
  try {
    const { idCompany } = req.params;
    let { month, year } = req.query;

    if (month === "") month = undefined;
    if (year === "") year = undefined;

    const bookingOrders = await getBookings(idCompany, month, year);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Booking Orders");

    const headers = [
      "ID Booking",
      "Amount",
      "Deposit",
      "Booking Time",
      "Requirement",
      "Status",
      "Customer Name",
      "Customer Email",
      "Customer Address",
      "Customer Phone",
      "Schedule Start",
      "Schedule End",
      "Reason",
    ];
    sheet.addRow(headers);

    if (bookingOrders.length === 0) {
      sheet.addRow(["Không có dữ liệu", ...Array(headers.length - 1).fill("")]);
    } else {
      bookingOrders.forEach((order) => {
        sheet.addRow([
          order._id ? order._id.toString() : "N/A",
          order.amount ?? 0,
          order.deposit ?? 0,
          order.bookingDate ? new Date(order.bookingDate).toISOString() : (order.createdAt ? new Date(order.createdAt).toISOString() : "N/A"),
          order.requirements ?? "N/A",
          order.status ?? "N/A",
          order.customerId?.fullName ?? "N/A",
          order.customerId?.email ?? "N/A",
          order.customerId?.address ?? "N/A",
          order.customerId?.phone ?? "N/A",
          order.scheduleId?.startDate ? new Date(order.scheduleId.startDate).toISOString() : "N/A",
          order.scheduleId?.endDate ? new Date(order.scheduleId.endDate).toISOString() : "N/A",
          order.reason ?? "N/A",
        ]);
      });
    }

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Booking_Order_${month || new Date().getMonth() + 1}_${year || new Date().getFullYear()}.xlsx`
    );

    // Ghi file trực tiếp vào response, không trả về bất kỳ dữ liệu nào khác
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    // Chỉ log lỗi, không trả về JSON khi export file
    console.error("Error exporting booking excel:", error);
    res.status(500).end();
  }
};

const getInfoCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate("accountId", "_id username roles status")
      .where("exist")
      .equals(1);

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found." });
    }

    res.status(200).json({
      success: true,
      message: "Company information retrieved successfully.",
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving company information.",
    });
  }
};

// ========== LOGIN COMPANY ==========
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginCompany = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Vui lòng nhập tên đăng nhập và mật khẩu" });
    }
    const account = await Account.findOne({ username, roles: "COMPANY" });
    if (!account) {
      return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }
    const isMatch = await bcryptjs.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }
    const company = await Company.findOne({ accountId: account._id });
    if (!company) {
      return res.status(404).json({ message: "Không tìm thấy thông tin công ty" });
    }
    const token = jwt.sign({ _id: account._id, role: account.roles }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({
      message: "Đăng nhập thành công",
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        address: company.address,
        username: account.username,
        accountId: company.accountId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};

const getBookingByYear = async (req, res) => {
  try {
    const { idCompany } = req.query;
    let { year } = req.query;

    if (!idCompany) {
      return res.status(400).json({ message: "Thiếu idCompany" });
    }

    // Nếu không có năm, dùng năm hiện tại
    if (!year) {
      year = new Date().getFullYear().toString();
    }

    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);

    // 1. Lấy tất cả yacht thuộc công ty
    const yachts = await YachtSchema.find({ IdCompanys: idCompany }).select("_id");
    const yachtIds = yachts.map((y) => y._id);

    // 2. Lấy tất cả booking của công ty trong cả năm
    const bookings = await BookingOrder.find({
      yacht: { $in: yachtIds },
      createdAt: { $gte: startDate, $lt: endDate },
    }).select("status createdAt"); // Chỉ lấy các trường cần thiết để tối ưu

    const monthNames = [
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

    // 3. Khởi tạo mảng kết quả thống kê cho 12 tháng
    const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
      Month: monthNames[i],
      pending: 0,
      cancel: 0,
      confirm: 0,
    }));

    // 4. Lặp qua các booking và đếm số lượng theo status
    bookings.forEach((booking) => {
      const monthIndex = new Date(booking.createdAt).getMonth(); // 0-11
      const status = (booking.status || "").toLowerCase();

      // Phân loại status
      if (status.includes("pending") || status.includes("requested")) {
        monthlyStats[monthIndex].pending++;
      } else if (status.includes("cancel") || status.includes("rejected")) {
        monthlyStats[monthIndex].cancel++;
      } else if (status.includes("confirm") || status.includes("completed")) {
        monthlyStats[monthIndex].confirm++;
      }
    });

    res.status(200).json({
      success: true,
      data: monthlyStats,
    });
  } catch (error) {
    console.error("Error in getBookingByYear:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thống kê booking theo năm", error: error.message });
  }
};

const getTotalBookingStats = async (req, res) => {
  try {
    const { idCompany } = req.query;
    let { month, year } = req.query;

    if (!idCompany) {
      return res.status(400).json({ message: "Thiếu idCompany" });
    }

    // Gán giá trị mặc định nếu không có tháng/năm
    const now = new Date();
    const a_month = month ? parseInt(month) : now.getMonth() + 1;
    const a_year = year ? parseInt(year) : now.getFullYear();

    const startDate = new Date(a_year, a_month - 1, 1);
    const endDate = new Date(a_year, a_month, 1);

    // 1. Lấy tất cả yacht thuộc công ty
    const yachts = await YachtSchema.find({ IdCompanys: idCompany }).select("_id");
    const yachtIds = yachts.map((y) => y._id);

    // 2. Lấy tất cả booking của công ty trong khoảng thời gian
    const bookings = await BookingOrder.find({
      yacht: { $in: yachtIds },
      createdAt: { $gte: startDate, $lt: endDate },
    }).select("status"); // Chỉ lấy status để tối ưu

    // 3. Đếm số lượng booking theo status
    const statusCounts = {};
    bookings.forEach((booking) => {
      const status = booking.status || "unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: statusCounts,
    });
  } catch (error) {
    console.error("Error in getTotalBookingStats:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thống kê booking", error: error.message });
  }
};

// Cập nhật profile công ty (tự sửa thông tin cá nhân)
const updateProfileCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const { name, address, email } = req.body;
    const logo = req.file || req.body.logo; // multer sẽ đẩy file vào req.file nếu là multipart

    console.log("== Received update:");
    console.log("Company ID:", companyId);
    console.log("Name:", name);
    console.log("Address:", address);
    console.log("Email:", email);
    console.log("Logo (req.file):", req.file);
    console.log("Logo (req.body.logo):", req.body.logo);

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: "Không tìm thấy công ty." });
    }

    if (name) company.name = name;
    if (address) company.address = address;
    if (email) company.email = email;

    if (req.file && req.file.path) {
      company.logo = req.file.path; // link từ Cloudinary
    }

    await company.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật profile thành công.",
      data: true,
    });
  } catch (error) {
    console.error("== Lỗi khi update profile công ty:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi cập nhật profile." });
  }
};

module.exports = {
  getAllCompany,
  createCompany,
  getAllCompanies,
  countCompanies,
  deleteCompany,
  updateCompany,
  getRevenueBooking,
  getRevenueService,
  getMonthlyRevenue,
  exportBooking,
  getInfoCompany,
  loginCompany,
  getBookingByYear,
  getTotalBookingStats,
  updateProfileCompany,
};

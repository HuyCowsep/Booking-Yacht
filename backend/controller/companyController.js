const { Company } = require('../model');

//lấy danh sách công ty du thuyền
const getAllCompany = async (req, res) => {
  try {
    const companies = await Company.find()
    .populate("accountId", "-_id username roles status")
    .where("exist")
    .equals(1); // Chỉ lấy company có exist = 1

    res.status(200).json({
      success: true,
      message: "Tất cả danh sách du thuyền.",
      data: companies,
    });
  } catch (error) {
    console.error("Error getting companies:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách công ty.",
    });
  }
};

module.exports = { getAllCompany };

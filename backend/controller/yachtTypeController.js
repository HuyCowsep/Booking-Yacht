const YachtType = require("../model/yachtType");

const getYachtType = async (req, res) => {
  try {
    const yachtTypes = await YachtType.find();
    res.status(200).json({ data: yachtTypes }); 
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách : " + err });
  }
};

module.exports = { getYachtType };

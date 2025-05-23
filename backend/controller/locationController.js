const { Location } = require("../models");

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().limit(3); // Giới hạn 3
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách địa điểm" });
  }
};

module.exports = { getLocations };

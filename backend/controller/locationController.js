const Location = require("../model/location");

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json({ data: locations }); 
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách địa điểm: " + err });
  }
};

module.exports = { getLocations };

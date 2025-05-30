const { YachtImage, Yacht } = require("../model");

exports.getYachtImageById = async (req, res) => {
  try {
    const yachtId = req.params.id;
    const yachtImage = await YachtImage.findOne({ yachtId: yachtId });

    if (!yachtImage) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hình ảnh cho du thuyền này",
      });
    }
    res.status(200).json({
      success: true,
      message: "Lấy hình ảnh du thuyền thành công",
      data: yachtImage.imageUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy hình ảnh du thuyền",
      error: error.message,
    });
  }
};

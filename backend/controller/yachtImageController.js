//getYachtImageById
const YachtImage = require("../model/yachtImages");
const Yacht = require("../model/yachtSchema");
const mongoose = require("mongoose");
const { cloudinary } = require("../utils/configClound");
exports.getYachtImageById = async (req, res) => {
  try {
    const yachtId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(yachtId)) {
      return res.status(400).json({ success: false, message: "YachtId không hợp lệ" });
    }
    const yachtImages = await YachtImage.find({ yachtId });
    res.status(200).json({
      success: true,
      data: yachtImages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while retrieving images",
      error: error.message,
    });
  }
};

exports.addImageToYacht = async (req, res) => {
  try {
    const { yachtId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(yachtId)) {
      return res.status(400).json({ success: false, message: "YachtId không hợp lệ" });
    }
    const yacht = await Yacht.findById(yachtId);
    if (!yacht) {
      return res.status(404).json({ success: false, message: "Không tìm thấy du thuyền" });
    }
    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: "Không có file ảnh upload" });
    }
    const yachtImage = new YachtImage({ yachtId, imageUrl: req.file.path });
    await yachtImage.save();
    res.status(200).json({ success: true, message: "Thêm ảnh thành công", data: yachtImage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server khi thêm ảnh", error: error.message });
  }
};

exports.updateImageOfYacht = async (req, res) => {
  try {
    const { idimage } = req.params;
    if (!mongoose.Types.ObjectId.isValid(idimage)) {
      return res.status(400).json({ success: false, message: "idimage không hợp lệ" });
    }
    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: "Không có file ảnh upload" });
    }
    const yachtImage = await YachtImage.findById(idimage);
    if (!yachtImage) {
      return res.status(404).json({ success: false, message: "Không tìm thấy ảnh" });
    }
    yachtImage.imageUrl = req.file.path;
    await yachtImage.save();
    res.status(200).json({ success: true, message: "Cập nhật ảnh thành công", data: yachtImage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server khi cập nhật ảnh", error: error.message });
  }
};

exports.deleteImageOfYacht = async (req, res) => {
  try {
    const { idimage } = req.params;
    if (!mongoose.Types.ObjectId.isValid(idimage)) {
      return res.status(400).json({ success: false, message: "idimage không hợp lệ" });
    }
    const yachtImage = await YachtImage.findByIdAndDelete(idimage);
    if (!yachtImage) {
      return res.status(404).json({ success: false, message: "Không tìm thấy ảnh" });
    }
    res.status(200).json({ success: true, message: "Xóa ảnh thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server khi xóa ảnh", error: error.message });
  }
};

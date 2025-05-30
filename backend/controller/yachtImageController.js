//getYachtImageById
const YachtImage = require("../model/yachtImages");
const Yacht = require("../model/yachtSchema");
const mongoose = require("mongoose");
exports.getYachtImageById = async (req, res) => {
  try {
    const yachtId = req.params.id;
    const yachtImage = await YachtImage.findOne({ yachtId: yachtId });
    if (!yachtImage) {
      return res.status(404).json({
        success: false,
        message: "No images found for this yacht",
      });
    }
    res.status(200).json({
      success: true,
      message: "Images retrieved successfully",
      data: yachtImage.imageUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while retrieving images",
      error: error.message,
    });
  }
};

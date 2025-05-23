const mongoose = require("mongoose");
const { Schema } = mongoose;

const yachtSchema = new Schema(
  {
    name: String, //tên du thuyền
    image: String, //hình ảnh
    launch: String, //năm hạ thuỷ
    description: String, //mô tả
    hullBody: String, //thân vỏ làm bằng gì
    rule: Number, //sức chứa hành khách
    itinerary: String, //lịch trình
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Location" }, //địa điểm du thuyền hoạt động
    yachtTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "YachtType" }, //loại du thuyền
    IdCompanys: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }, //công ty sở hữu hoặc điều hành du thuyền
    isDeleted: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Yacht", yachtSchema, "yachts");
//done

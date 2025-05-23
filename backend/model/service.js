const mongoose = require("mongoose");
const { Schema } = mongoose;

const serviceSchema = new Schema({
  serviceName: String, //tên dich vụ
  price: Number, //giá tiền
});

module.exports = mongoose.model("Service", serviceSchema, "services");
//done
const mongoose = require("mongoose");
const { Schema } = mongoose;

const yachTypeSchema = new Schema({
  name: String, //tên loại: sang trọng, bình dân, gia đình,..
  ranking: Number, //số sao
});

module.exports = mongoose.model("YachtType", yachTypeSchema, "yachtTypes");
//done
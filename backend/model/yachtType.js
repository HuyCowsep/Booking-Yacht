const mongoose = require("mongoose");
const { Schema } = mongoose;

const yachTypeSchema = new Schema({
    starRanking: Number,
});

module.exports = mongoose.model("YachtType", yachTypeSchema, "yachtTypes");
//done
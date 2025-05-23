const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = new Schema({
  name: String,
});

module.exports = mongoose.model("Location", locationSchema, "locations");
//done
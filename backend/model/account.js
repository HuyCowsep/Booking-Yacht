const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: {
    type: String,
    enum: ['ADMIN', 'CUSTOMER', 'COMPANY'],
    required: true,
  },
  status: { type: Number, default: 1 },
});

accountSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next();
});

accountSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

module.exports = mongoose.model('Account', accountSchema, 'accounts');
//done
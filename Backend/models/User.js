const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student','instructor','admin'], default: 'student' },
  createdAt: { type: Date, default: Date.now },
  otp: { type: String, default: null },
  otpExpire: { type: Date, default: null }
});

module.exports = mongoose.model('User', userSchema);

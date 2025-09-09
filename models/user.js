// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, trim: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ['patient', 'caregiver', 'provider', 'admin'], default: 'patient' },
  meta: { type: Object } // flexible field for extras
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

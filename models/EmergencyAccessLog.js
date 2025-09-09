// models/EmergencyAccessLog.js
const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // whose card was accessed
  accessed_at: { type: Date, default: Date.now, index: true },
  method: { type: String, enum: ['qr','nfc','share_token','link','api'], default: 'qr' },
  ip: { type: String },
  device_info: { type: String },
  data_returned: [{ type: String }], // list of fields returned
  share_token_used: { type: String },
  meta: { type: Object }
}, { timestamps: false });

module.exports = mongoose.model('EmergencyAccessLog', accessLogSchema);

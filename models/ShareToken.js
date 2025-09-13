// models/ShareToken.js
const mongoose = require('mongoose');

const shareTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true, index: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional: share whole profile
  record_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' }],
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expires_at: { type: Date },
  single_use: { type: Boolean, default: true },
  used: { type: Boolean, default: false },
  meta: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('ShareToken', shareTokenSchema);

// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  url: { type: String, required: true },
  public_id: { type: String }, // cloud storage id
  filename: { type: String },
  mime: { type: String },
  size: { type: Number },
  upload_method: { type: String, enum: ['cloudinary', 'local'], default: 'local' },
  uploaded_at: { type: Date, default: Date.now },
  meta: { type: Object }
}, { timestamps: false });

module.exports = mongoose.model('File', fileSchema);

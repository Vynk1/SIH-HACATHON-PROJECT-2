// models/MedicalRecord.js
const mongoose = require('mongoose');

const fileRefSchema = new mongoose.Schema({
  file_id: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
  url: String,
  filename: String,
  mime: String,
  size: Number
}, { _id: false });

const medicalRecordSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // patient
  uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who uploaded it
  type: { type: String, enum: ['prescription','report','diagnosis','treatment','other'], default: 'prescription' },
  title: { type: String, trim: true },
  description: { type: String },
  date_of_visit: { type: Date, default: Date.now },
  files: [fileRefSchema],
  tags: [{ type: String }],
  verified_by_provider: { type: Boolean, default: false },
  visibility: { type: String, enum: ['private','shared','public_emergency'], default: 'private' },
  deleted: { type: Boolean, default: false },
  meta: { type: Object }
}, { timestamps: true });

medicalRecordSchema.index({ user_id: 1, date_of_visit: -1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);

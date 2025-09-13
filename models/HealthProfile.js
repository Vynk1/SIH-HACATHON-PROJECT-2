// models/HealthProfile.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String,
  relation: String,
  phone: String,
  notes: String
}, { _id: false });

const medicationSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  frequency: String
}, { _id: false });

const healthProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  dob: { type: Date },
  gender: { type: String },
  blood_group: { type: String },
  weight_kg: { type: Number },
  height_cm: { type: Number },
  allergies: [{ type: String }],
  chronic_conditions: [{ type: String }],
  medications: [medicationSchema],
  emergency_contacts: [contactSchema],
  primary_physician: { name: String, phone: String, provider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } },
  public_emergency_id: { type: String, index: true, unique: true, sparse: true },
  public_emergency_summary: { type: String },
  meta: { type: Object }
}, { timestamps: true });

// Ensure there is an index on public_emergency_id for fast lookup
healthProfileSchema.index({ public_emergency_id: 1 });

module.exports = mongoose.model('HealthProfile', healthProfileSchema);

// controllers/card.controller.js
const HealthProfile = require('../models/HealthProfile');
const User = require('../models/User');
const { nanoid } = require('nanoid');

/**
 * GET /api/user/me
 * returns user + health profile (if patient)
 */
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const healthProfile = await HealthProfile.findOne({ user_id: userId }).lean();
    
    // Structure the response to match frontend expectations
    const profile = {
      ...user.toObject(),
      health_profile: healthProfile,
      // For backward compatibility, also include health profile fields directly
      ...healthProfile
    };
    
    res.json({ user, profile });
  } catch (err) {
    console.error('getMyProfile', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/user/me/health
 * create or update health profile
 */
exports.upsertHealthProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const body = req.body;

    // For safety, only allow certain fields (whitelist)
    const allowed = [
      'dob','gender','blood_group','weight_kg','height_cm',
      'allergies','chronic_conditions','medications','emergency_contacts',
      'primary_physician','public_emergency_summary'
    ];
    const data = {};
    for (const k of allowed) if (body[k] !== undefined) data[k] = body[k];

    // Ensure public_emergency_id exists for public QR/NFC
    let profile = await HealthProfile.findOne({ user_id: userId });
    if (!profile) {
      data.user_id = userId;
      data.public_emergency_id = body.public_emergency_id || nanoid(8);
      profile = await HealthProfile.create(data);
      return res.status(201).json(profile);
    }

    // Update
    allowed.forEach(k => { if (data[k] !== undefined) profile[k] = data[k]; });
    // if user wants to reset public id
    if (body.reset_public_id) profile.public_emergency_id = nanoid(8);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error('upsertHealthProfile error:', err);
    
    // Handle specific mongoose errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate key error' });
    }
    
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * GET public emergency id for current user (owner only)
 */
exports.getMyPublicId = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const profile = await HealthProfile.findOne({ user_id: userId }).select('public_emergency_id');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ public_emergency_id: profile.public_emergency_id });
  } catch (err) {
    console.error('getMyPublicId', err);
    res.status(500).json({ message: 'Server error' });
  }
};


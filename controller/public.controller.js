// controllers/public.controller.js
const HealthProfile = require('../models/HealthProfile');
const EmergencyAccessLog = require('../models/EmergencyAccessLog');
const ShareToken = require('../models/ShareToken');
const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/user');

/**
 * GET /e/:publicId
 * Public emergency view (no auth)
 */
exports.publicEmergencyView = async (req, res) => {
  try {
    const publicId = req.params.publicId;
    const profile = await HealthProfile.findOne({ public_emergency_id: publicId }).populate('user_id','full_name');
    if (!profile) return res.status(404).json({ message: 'Not found' });

    const age = profile.dob ? Math.floor((Date.now() - profile.dob.getTime()) / (1000*60*60*24*365.25)) : null;
    const result = {
      public_id: publicId,
      name: profile.user_id.full_name,
      age,
      blood_group: profile.blood_group || null,
      allergies: profile.allergies || [],
      chronic_conditions: profile.chronic_conditions || [],
      emergency_contacts: profile.emergency_contacts || [],
      note: profile.public_emergency_summary || null
    };

    // Log the access
    await EmergencyAccessLog.create({
      user_id: profile.user_id._id,
      accessed_at: new Date(),
      method: 'qr',
      ip: req.ip,
      device_info: req.get('User-Agent') || '',
      data_returned: Object.keys(result)
    });

    res.json(result);
  } catch (err) {
    console.error('publicEmergencyView', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /share/:token
 * Access full data via share token (one-time/time-limited)
 */
exports.getSharedData = async (req, res) => {
  try {
    const token = req.params.token;
    const st = await ShareToken.findOne({ token });
    if (!st) return res.status(404).json({ message: 'Invalid token' });
    if (st.expires_at && new Date() > st.expires_at) return res.status(410).json({ message: 'Token expired' });
    if (st.single_use && st.used) return res.status(410).json({ message: 'Token already used' });

    // Build data payload: either list of record ids or user_id full profile
    let payload = {};
    if (st.record_ids && st.record_ids.length) {
      const records = await MedicalRecord.find({ _id: { $in: st.record_ids } }).lean();
      payload.records = records;
    } else if (st.user_id) {
      const user = await User.findById(st.user_id).select('-password').lean();
      const profile = await HealthProfile.findOne({ user_id: st.user_id }).lean();
      const records = await MedicalRecord.find({ user_id: st.user_id }).lean();
      payload.user = user;
      payload.profile = profile;
      payload.records = records;
    } else {
      return res.status(400).json({ message: 'Nothing to share' });
    }

    // Mark single use tokens as used
    if (st.single_use) {
      st.used = true;
      await st.save();
    }

    // Log
    await EmergencyAccessLog.create({
      user_id: st.user_id || (payload.user ? payload.user._id : null),
      accessed_at: new Date(),
      method: 'share_token',
      ip: req.ip,
      device_info: req.get('User-Agent') || '',
      data_returned: Object.keys(payload)
    });

    res.json(payload);
  } catch (err) {
    console.error('getSharedData', err);
    res.status(500).json({ message: 'Server error' });
  }
};

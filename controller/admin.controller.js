// controllers/admin.controller.js
const User = require('../models/user');
const HealthProfile = require('../models/HealthProfile');
const MedicalRecord = require('../models/MedicalRecord');
// const Donation = require('../models/Donation'); // if used
const EmergencyAccessLog = require('../models/EmergencyAccessLog');

/**
 * GET /api/admin/summary
 * Return KPIs for admin dashboard
 */
exports.getSummary = async (req, res) => {
  try {
    // only admin allowed (middleware should check but double-check)
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalProfiles = await HealthProfile.countDocuments();
    const totalRecords = await MedicalRecord.countDocuments();
    const recentAccesses = await EmergencyAccessLog.find().sort({ accessed_at: -1 }).limit(10).lean();

    res.json({
      totalUsers, totalPatients, totalProviders, totalProfiles, totalRecords,
      recentAccesses
    });
  } catch (err) {
    console.error('admin.getSummary', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/admin/users
 * Paginated users list
 */
exports.listUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { page = 1, limit = 50, q } = req.query;
    const query = {};
    if (q) query.$or = [{ full_name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
    const total = await User.countDocuments(query);
    const users = await User.find(query).select('-password').skip((page-1)*limit).limit(Number(limit)).lean();
    res.json({ meta: { page: Number(page), limit: Number(limit), total }, data: users });
  } catch (err) {
    console.error('admin.listUsers', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/admin/access-logs
 */
exports.listAccessLogs = async (req,res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { page = 1, limit = 50 } = req.query;
    const total = await EmergencyAccessLog.countDocuments();
    const logs = await EmergencyAccessLog.find().sort({ accessed_at: -1 }).skip((page-1)*limit).limit(Number(limit)).lean();
    res.json({ meta: { page: Number(page), limit: Number(limit), total }, data: logs });
  } catch (err) {
    console.error('admin.listAccessLogs', err);
    res.status(500).json({ message: 'Server error' });
  }
};


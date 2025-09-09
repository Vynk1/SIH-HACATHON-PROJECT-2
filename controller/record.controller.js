// controllers/record.controller.js
const MedicalRecord = require('../models/MedicalRecord');
const File = require('../models/File');
const HealthProfile = require('../models/HealthProfile');

/**
 * POST /api/records
 * create a medical record (patient or provider)
 */
exports.createRecord = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const {
      user_id, // which patient this record is for (providers pass this)
      type = 'prescription',
      title,
      description,
      date_of_visit,
      files = [],
      tags = [],
      visibility = 'private'
    } = req.body;

    const targetUser = user_id || userId;
    // if provider creating records for other patients, ensure role
    if (targetUser !== userId && req.user.role !== 'provider' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed to create record for other user' });
    }

    const rec = await MedicalRecord.create({
      user_id: targetUser,
      uploaded_by: userId,
      type,
      title,
      description,
      date_of_visit: date_of_visit ? new Date(date_of_visit) : new Date(),
      files,
      tags,
      verified_by_provider: req.user.role === 'provider',
      visibility
    });

    res.status(201).json(rec);
  } catch (err) {
    console.error('createRecord', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/records
 * list records for a user (ownership + visibility enforced)
 * query params: user_id (optional), page, limit
 */
exports.listRecords = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { user_id, page = 1, limit = 20 } = req.query;

    const target = user_id || userId;
    // if requesting other user's records, only providers/admin can view
    if (target !== String(userId) && !(req.user.role === 'provider' || req.user.role === 'admin')) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const filter = { user_id: target };
    // apply visibility filter for non-admin/provider and when viewing others
    if (!(req.user.role === 'provider' || req.user.role === 'admin') && target !== String(userId)) {
      filter.visibility = { $in: ['public_emergency', 'shared'] };
    }

    const total = await MedicalRecord.countDocuments(filter);
    const data = await MedicalRecord.find(filter)
      .sort({ date_of_visit: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    res.json({ meta: { page: Number(page), limit: Number(limit), total }, data });
  } catch (err) {
    console.error('listRecords', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/records/:id
 */
exports.getRecord = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;
    const rec = await MedicalRecord.findById(id).lean();
    if (!rec) return res.status(404).json({ message: 'Record not found' });

    // permission check: owner, provider, admin or shared/public
    if (String(rec.user_id) !== String(userId) && req.user.role !== 'provider' && req.user.role !== 'admin') {
      if (rec.visibility !== 'shared' && rec.visibility !== 'public_emergency') {
        return res.status(403).json({ message: 'Not allowed' });
      }
    }

    res.json(rec);
  } catch (err) {
    console.error('getRecord', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PATCH /api/records/:id
 */
exports.updateRecord = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;
    const rec = await MedicalRecord.findById(id);
    if (!rec) return res.status(404).json({ message: 'Record not found' });

    // only owner, provider, or admin can update
    if (String(rec.user_id) !== String(userId) && req.user.role !== 'provider' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const allowed = ['title','description','visibility','tags','verified_by_provider','date_of_visit','files'];
    allowed.forEach(k => {
      if (req.body[k] !== undefined) rec[k] = req.body[k];
    });

    await rec.save();
    res.json(rec);
  } catch (err) {
    console.error('updateRecord', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/records/:id
 * soft-delete (set a deleted flag) or permanently delete depending on model
 */
exports.deleteRecord = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;
    const rec = await MedicalRecord.findById(id);
    if (!rec) return res.status(404).json({ message: 'Record not found' });

    if (String(rec.user_id) !== String(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    // If you have soft-delete:
    rec.deleted = true;
    await rec.save();
    // Or use rec.remove() for hard delete:
    // await rec.remove();

    res.json({ message: 'Record deleted' });
  } catch (err) {
    console.error('deleteRecord', err);
    res.status(500).json({ message: 'Server error' });
  }
};


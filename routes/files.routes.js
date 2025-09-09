// routes/files.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload'); // multer memoryStorage
const File = require('../models/File');
const cloudinary = require('../utils/cloudinary'); // if using Cloudinary
const streamifier = require('streamifier');

// POST /api/files/upload
router.post('/upload', auth(), uploadMiddleware.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    // Upload buffer to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'swasthya_files' }, (error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    const fileDoc = await File.create({
      user_id: req.user.id || req.user._id,
      url: result.secure_url,
      public_id: result.public_id,
      filename: req.file.originalname,
      mime: req.file.mimetype,
      size: req.file.size
    });

    res.json({ id: fileDoc._id, url: fileDoc.url, filename: fileDoc.filename, mime: fileDoc.mime, size: fileDoc.size });
  } catch (err) {
    console.error('file.upload.err', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// DELETE /api/files/:id (owner or admin)
router.delete('/:id', auth(), async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'Not found' });

    // owner or admin only
    const userId = req.user.id || req.user._id;
    if (String(file.user_id) !== String(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // delete from cloudinary
    if (file.public_id) {
      await cloudinary.uploader.destroy(file.public_id);
    }
    await file.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('file.delete.err', err);
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;

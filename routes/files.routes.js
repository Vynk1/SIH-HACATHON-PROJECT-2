// routes/files.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload'); // multer memoryStorage
const File = require('../models/File');
const localStorage = require('../utils/localStorage');
const streamifier = require('streamifier');

// Try to use Supabase first, then Cloudinary, then local storage
let supabaseStorage;
try {
  supabaseStorage = require('../utils/supabase');
  if (supabaseStorage) {
    console.log('✅ Supabase storage initialized');
  }
} catch (error) {
  console.warn('⚠️  Supabase not configured:', error.message);
  supabaseStorage = null;
}

let cloudinary;
try {
  cloudinary = require('../utils/cloudinary');
} catch (error) {
  console.warn('⚠️  Cloudinary not configured, using local storage for file uploads');
  cloudinary = null;
}

// POST /api/files/upload
router.post('/upload', auth(), uploadMiddleware.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    let result;
    let uploadMethod = 'local';
    const userId = req.user.id || req.user._id;

    // Try Supabase first if configured
    if (supabaseStorage) {
      try {
        result = await supabaseStorage.uploadFile(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          userId
        );
        uploadMethod = 'supabase';
        console.log('📦 File uploaded to Supabase:', result.public_id);
        
      } catch (supabaseError) {
        console.warn('⚠️  Supabase upload failed, trying Cloudinary:', supabaseError.message);
        supabaseStorage = null; // Disable supabase for subsequent requests
      }
    }

    // Try Cloudinary if Supabase failed or not configured
    if (!result && cloudinary) {
      try {
        const streamUpload = (buffer) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: 'swasthya_files' }, (error, result) => {
              if (result) resolve(result);
              else reject(error);
            });
            streamifier.createReadStream(buffer).pipe(stream);
          });
        };
        
        result = await streamUpload(req.file.buffer);
        uploadMethod = 'cloudinary';
        console.log('☁️ File uploaded to Cloudinary:', result.public_id);
        
      } catch (cloudinaryError) {
        console.warn('⚠️  Cloudinary upload failed, falling back to local storage:', cloudinaryError.message);
        cloudinary = null; // Disable cloudinary for subsequent requests
      }
    }
    
    // Use local storage if both cloud options failed or not configured
    if (!result) {
      result = await localStorage.saveFile(req.file.buffer, req.file.originalname, req.file.mimetype);
      uploadMethod = 'local';
      console.log('💾 File uploaded to local storage:', result.secure_url);
    }

    const fileDoc = await File.create({
      user_id: req.user.id || req.user._id,
      url: result.secure_url,
      public_id: result.public_id,
      filename: req.file.originalname,
      mime: req.file.mimetype,
      size: req.file.size,
      upload_method: uploadMethod
    });

    res.json({ 
      id: fileDoc._id, 
      url: fileDoc.url, 
      filename: fileDoc.filename, 
      mime: fileDoc.mime, 
      size: fileDoc.size,
      upload_method: uploadMethod
    });
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

    // Delete from appropriate storage
    if (file.upload_method === 'supabase' && supabaseStorage && file.public_id) {
      try {
        await supabaseStorage.deleteFile(file.public_id);
        console.log('📦 File deleted from Supabase:', file.public_id);
      } catch (error) {
        console.warn('⚠️  Failed to delete from Supabase:', error.message);
      }
    } else if (file.upload_method === 'cloudinary' && cloudinary && file.public_id) {
      try {
        await cloudinary.uploader.destroy(file.public_id);
        console.log('☁️ File deleted from Cloudinary:', file.public_id);
      } catch (error) {
        console.warn('⚠️  Failed to delete from Cloudinary:', error.message);
      }
    } else if (file.upload_method === 'local' && file.public_id) {
      await localStorage.deleteFile(file.public_id);
      console.log('💾 File deleted from local storage:', file.public_id);
    }
    
    await file.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('file.delete.err', err);
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;

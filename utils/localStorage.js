// utils/localStorage.js
const fs = require('fs').promises;
const path = require('path');
const { nanoid } = require('nanoid');

// Create uploads directory if it doesn't exist
const UPLOADS_DIR = path.join(__dirname, '../uploads');

async function ensureUploadDir() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

/**
 * Save file locally and return file info
 * @param {Buffer} buffer - File buffer
 * @param {string} originalname - Original filename
 * @param {string} mimetype - MIME type
 * @returns {Object} File information
 */
async function saveFile(buffer, originalname, mimetype) {
  await ensureUploadDir();
  
  // Generate unique filename
  const ext = path.extname(originalname);
  const filename = `${nanoid(12)}${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);
  
  // Save file
  await fs.writeFile(filepath, buffer);
  
  // Return file info in Cloudinary-like format
  return {
    public_id: filename.replace(ext, ''),
    secure_url: `/uploads/${filename}`,
    original_filename: originalname,
    format: ext.slice(1), // Remove the dot
    bytes: buffer.length,
    resource_type: mimetype.startsWith('image/') ? 'image' : 'raw'
  };
}

/**
 * Delete file from local storage
 * @param {string} public_id - File public ID (filename without extension)
 */
async function deleteFile(public_id) {
  try {
    // Find file with this public_id (could have various extensions)
    const files = await fs.readdir(UPLOADS_DIR);
    const fileToDelete = files.find(file => file.startsWith(public_id));
    
    if (fileToDelete) {
      await fs.unlink(path.join(UPLOADS_DIR, fileToDelete));
    }
  } catch (error) {
    console.error('Error deleting local file:', error);
    // Don't throw error, just log it
  }
}

/**
 * Check if a file exists
 * @param {string} filename - Filename to check
 */
async function fileExists(filename) {
  try {
    await fs.access(path.join(UPLOADS_DIR, filename));
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  saveFile,
  deleteFile,
  fileExists,
  UPLOADS_DIR
};
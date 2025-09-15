// utils/supabase.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not found in environment variables');
  module.exports = null;
} else {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Function to upload file to Supabase Storage
  async function uploadFile(buffer, filename, mimetype, userId) {
    try {
      // Create a unique filename with user ID and timestamp
      const timestamp = Date.now();
      const fileExtension = filename.split('.').pop();
      const uniqueFilename = `${userId}/${timestamp}_${filename}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('medical-records') // bucket name
        .upload(uniqueFilename, buffer, {
          contentType: mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('medical-records')
        .getPublicUrl(uniqueFilename);

      return {
        secure_url: publicUrlData.publicUrl,
        public_id: uniqueFilename,
        original_filename: filename,
        bytes: buffer.length
      };
    } catch (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }
  }

  // Function to delete file from Supabase Storage
  async function deleteFile(publicId) {
    try {
      const { error } = await supabase.storage
        .from('medical-records')
        .remove([publicId]);

      if (error) {
        throw new Error(`Supabase delete error: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
  }

  module.exports = {
    supabase,
    uploadFile,
    deleteFile
  };
}
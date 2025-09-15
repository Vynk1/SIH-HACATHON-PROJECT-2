#!/usr/bin/env node
// scripts/test-cloudinary.js

require('dotenv').config();
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');

async function testCloudinary() {
  try {
    console.log('☁️  Testing Cloudinary connection...\n');
    
    // Test 1: Check configuration
    console.log('1️⃣  Checking Cloudinary configuration...');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Missing Cloudinary configuration variables');
    }
    
    // Test 2: Ping Cloudinary API
    console.log('\n2️⃣  Testing Cloudinary API connection...');
    const pingResult = await cloudinary.api.ping();
    console.log('✅ Cloudinary API ping successful:', pingResult);
    
    // Test 3: Create a test image buffer and upload
    console.log('\n3️⃣  Testing file upload...');
    
    // Create a simple 1x1 pixel PNG in base64
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const testImageBuffer = Buffer.from(testImageBase64, 'base64');
    
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { 
          folder: 'swasthya_test',
          resource_type: 'image',
          format: 'png'
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      
      stream.end(testImageBuffer);
    });
    
    console.log('✅ Test upload successful!');
    console.log('Public ID:', uploadResult.public_id);
    console.log('URL:', uploadResult.secure_url);
    console.log('Size:', uploadResult.bytes, 'bytes');
    
    // Test 4: Clean up test file
    console.log('\n4️⃣  Cleaning up test file...');
    await cloudinary.uploader.destroy(uploadResult.public_id);
    console.log('✅ Test file cleaned up');
    
    console.log('\n🎉 All Cloudinary tests passed! Upload functionality should work.');
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:');
    console.error('Full error:', error);
    
    if (error && error.message) {
      console.error('Error message:', error.message);
      
      if (error.message.includes('Invalid cloud_name')) {
        console.error('\n💡 Fix: Check CLOUDINARY_CLOUD_NAME in .env file');
      } else if (error.message.includes('Invalid API key')) {
        console.error('\n💡 Fix: Check CLOUDINARY_API_KEY in .env file');
      } else if (error.message.includes('Invalid API secret')) {
        console.error('\n💡 Fix: Check CLOUDINARY_API_SECRET in .env file');
      }
    }
    
    if (error && error.http_code) {
      console.error('HTTP Code:', error.http_code);
    }
    
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  testCloudinary();
}

module.exports = testCloudinary;
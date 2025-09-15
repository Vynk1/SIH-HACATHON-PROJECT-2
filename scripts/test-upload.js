#!/usr/bin/env node
// scripts/test-upload.js

const axios = require('axios');
const FormData = require('form-data');

const API_BASE = 'http://localhost:5000';
const TEST_EMAIL = 'rajesh.kumar@demo.com';
const TEST_PASSWORD = 'demo123';

async function testUpload() {
  try {
    console.log('🧪 Testing file upload functionality...\n');
    
    // Test 1: Login first
    console.log('1️⃣  Logging in...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Test 2: Test file upload endpoint
    console.log('\n2️⃣  Testing file upload...');
    
    // Create a test image (1x1 pixel PNG)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const testImageBuffer = Buffer.from(testImageBase64, 'base64');
    
    const formData = new FormData();
    formData.append('file', testImageBuffer, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    
    const uploadResponse = await axios.post(`${API_BASE}/api/files/upload`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders()
      }
    });
    
    console.log('✅ File upload successful!');
    console.log('📁 File ID:', uploadResponse.data.id);
    console.log('🔗 URL:', uploadResponse.data.url);
    console.log('📦 Size:', uploadResponse.data.size, 'bytes');
    console.log('⚙️  Upload method:', uploadResponse.data.upload_method);
    
    // Test 3: Create a medical record with the file
    console.log('\n3️⃣  Testing medical record creation with file...');
    
    const recordData = {
      type: 'other',
      title: 'Test Upload Record',
      description: 'Testing file upload functionality',
      date_of_visit: new Date().toISOString().split('T')[0],
      files: [{
        file_id: uploadResponse.data.id,
        url: uploadResponse.data.url,
        filename: uploadResponse.data.filename,
        mime: uploadResponse.data.mime,
        size: uploadResponse.data.size
      }],
      tags: ['test', 'upload'],
      visibility: 'private'
    };
    
    const recordResponse = await axios.post(`${API_BASE}/api/records`, recordData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Medical record created with file attachment!');
    console.log('📋 Record ID:', recordResponse.data._id);
    console.log('📎 Files attached:', recordResponse.data.files.length);
    
    // Test 4: Verify we can retrieve the record
    console.log('\n4️⃣  Testing record retrieval...');
    
    const listResponse = await axios.get(`${API_BASE}/api/records`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const testRecord = listResponse.data.data.find(r => r.title === 'Test Upload Record');
    if (testRecord) {
      console.log('✅ Test record found in records list');
      console.log('📎 Files in record:', testRecord.files.length);
    } else {
      throw new Error('Test record not found in records list');
    }
    
    console.log('\n🎉 All file upload tests passed! File upload functionality is working.');
    
  } catch (error) {
    console.error('❌ File upload test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  testUpload();
}

module.exports = testUpload;
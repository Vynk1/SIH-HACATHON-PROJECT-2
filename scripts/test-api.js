#!/usr/bin/env node
// scripts/test-api.js

const axios = require('axios');

const API_BASE = 'http://localhost:5000';
const TEST_EMAIL = 'rajesh.kumar@demo.com';
const TEST_PASSWORD = 'demo123';

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');
    
    // Test 1: Login
    console.log('1️⃣  Testing login...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log('✅ Login successful:', user.full_name);
    
    // Test 2: Get user profile
    console.log('\n2️⃣  Testing get user profile...');
    const profileResponse = await axios.get(`${API_BASE}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Profile retrieved:', profileResponse.data.user.full_name);
    console.log('✅ Health profile exists:', !!profileResponse.data.profile);
    
    // Test 3: List medical records
    console.log('\n3️⃣  Testing medical records list...');
    const recordsResponse = await axios.get(`${API_BASE}/api/records`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Medical records retrieved:', recordsResponse.data.data.length, 'records');
    console.log('✅ Total records:', recordsResponse.data.meta.total);
    
    // Test 4: Test file upload endpoint exists
    console.log('\n4️⃣  Testing file upload endpoint...');
    try {
      const testForm = new FormData();
      // We'll get a "no file" error but that means the endpoint exists
      await axios.post(`${API_BASE}/api/files/upload`, testForm, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === 'No file provided') {
        console.log('✅ File upload endpoint exists and working');
      } else {
        throw error;
      }
    }
    
    console.log('\n🎉 All API tests passed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
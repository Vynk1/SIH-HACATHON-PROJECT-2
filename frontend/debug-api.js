// Simple Node.js script to test API connectivity from frontend perspective
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function testAPIConnectivity() {
  console.log('🔧 Frontend API Connectivity Test');
  console.log('================================');
  
  try {
    // Test 1: Health check
    console.log('\n1. Testing server health...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Server health: OK');
    
    // Test 2: Registration
    console.log('\n2. Testing registration...');
    const testUser = {
      full_name: 'Frontend Test User',
      email: 'frontend.test@example.com',
      phone: '1234567890',
      password: 'FrontendTest123'
    };
    
    try {
      const regResponse = await axios.post(`${API_BASE_URL}/api/auth/register`, testUser, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('✅ Registration: SUCCESS');
      console.log('  - Token received:', regResponse.data.token ? 'Yes' : 'No');
      console.log('  - User data:', regResponse.data.user.full_name);
      
      // Test 3: Login with the new user
      console.log('\n3. Testing login...');
      const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('✅ Login: SUCCESS');
      console.log('  - Token received:', loginResponse.data.token ? 'Yes' : 'No');
      
    } catch (regError) {
      if (regError.response?.data?.message?.includes('already registered')) {
        console.log('ℹ️  Registration: User already exists (this is OK)');
        
        // Test login with existing user
        console.log('\n3. Testing login with existing user...');
        const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: testUser.email,
          password: testUser.password
        });
        console.log('✅ Login: SUCCESS');
      } else {
        throw regError;
      }
    }
    
    console.log('\n🎉 All API tests PASSED!');
    console.log('\nThe backend API is working correctly.');
    console.log('If frontend login/registration is failing, the issue is likely in:');
    console.log('- CORS configuration');
    console.log('- Frontend not connecting to correct URL'); 
    console.log('- Browser console errors');
    console.log('- Frontend state management');
    
  } catch (error) {
    console.log('\n❌ API Test FAILED');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    }
    console.log('\nPossible issues:');
    console.log('- Backend server not running on port 5000');
    console.log('- CORS issues');
    console.log('- Network connectivity problems');
  }
}

testAPIConnectivity();
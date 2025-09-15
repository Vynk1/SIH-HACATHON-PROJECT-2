// test-api.js - Simple script to test the authentication endpoints
const axios = require('axios');

const API_BASE = 'http://localhost:5000';

async function testAuth() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check passed:', health.data.status);

    // Test 2: Register a new user
    console.log('\n2. Testing user registration...');
    const userData = {
      full_name: 'Test User',
      email: `test${Date.now()}@example.com`, // Unique email
      phone: '+1234567890',
      password: 'Password123',
      role: 'patient'
    };

    const registerResponse = await axios.post(`${API_BASE}/api/auth/register`, userData);
    console.log('✅ Registration successful!');
    console.log('Token:', registerResponse.data.token.substring(0, 20) + '...');
    console.log('User:', registerResponse.data.user.full_name);

    const { token } = registerResponse.data;

    // Test 3: Login with the same credentials
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: userData.email,
      password: userData.password
    });
    console.log('✅ Login successful!');
    console.log('User email:', loginResponse.data.user.email);

    // Test 4: Get user profile
    console.log('\n4. Testing get user profile...');
    const profileResponse = await axios.get(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieval successful!');
    console.log('Profile:', profileResponse.data.full_name, '-', profileResponse.data.email);

    // Test 5: Test validation error
    console.log('\n5. Testing validation errors...');
    try {
      await axios.post(`${API_BASE}/api/auth/register`, {
        full_name: '',
        email: 'invalid-email',
        password: '123' // Too short and no uppercase
      });
    } catch (error) {
      console.log('✅ Validation error caught correctly:');
      console.log('   Message:', error.response.data.message);
    }

    console.log('\n🎉 All tests passed! Authentication is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure the server is running on port 5000');
    }
  }
}

// Run the test if server is available
testAuth();
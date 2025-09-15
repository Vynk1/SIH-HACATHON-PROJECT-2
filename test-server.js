// Simple test script for basic server functionality
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testServer() {
  console.log('🧪 Testing Swasthya Health Card Server...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    console.log('   Database status:', healthResponse.data.database);
    
    // Test 2: Register new user
    console.log('\n2. Testing user registration...');
    const userData = {
      full_name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123',
      phone: '+1234567890',
      role: 'patient'
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    console.log('✅ Registration successful');
    console.log('   User:', registerResponse.data.user.full_name);
    console.log('   Token received:', registerResponse.data.token ? 'Yes' : 'No');
    
    // Test 3: Login
    console.log('\n3. Testing user login...');
    const loginData = {
      email: 'test@example.com',
      password: 'testpassword123'
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    console.log('✅ Login successful');
    const token = loginResponse.data.token;
    
    // Test 4: Get user profile
    console.log('\n4. Testing authenticated endpoint...');
    const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Profile retrieved:', meResponse.data.email);
    
    console.log('\n🎉 All tests passed! Server is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    process.exit(1);
  }
}

// Check if axios is available, if not suggest installation
try {
  require('axios');
  testServer();
} catch (err) {
  console.log('📦 Installing axios for testing...');
  const { exec } = require('child_process');
  exec('npm install axios', (error, stdout, stderr) => {
    if (error) {
      console.log('Please install axios manually: npm install axios');
      return;
    }
    console.log('✅ Axios installed, running tests...\n');
    testServer();
  });
}
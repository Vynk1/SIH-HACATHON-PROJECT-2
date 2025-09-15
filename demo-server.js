// demo-server.js - Simplified server for hackathon demo
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import mock data
const { db, demoCredentials } = require('./data/mockData');

const app = express();

// Basic middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Simple session storage (in memory for demo)
const sessions = new Map();

// Simple auth middleware
const simpleAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  req.user = sessions.get(token);
  next();
};

console.log('\n🎯 DEMO MODE - Available Login Credentials:');
console.log('📧 Email: rajesh@demo.com | Password: demo123 (Patient - Dr. Rajesh Kumar)');
console.log('📧 Email: priya@demo.com  | Password: demo123 (Patient - Priya Sharma)');
console.log('📧 Email: amit@demo.com   | Password: demo123 (Provider - Dr. Amit Verma)');
console.log('');

// ================================
// AUTH ROUTES
// ================================

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  // Check demo credentials
  const user = db.users.findOne({ email: email.toLowerCase() });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create simple session token
  const token = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessions.set(token, { 
    id: user._id, 
    email: user.email, 
    full_name: user.full_name,
    role: user.role,
    public_emergency_id: user.public_emergency_id
  });

  console.log(`✅ Login: ${user.full_name} (${user.email})`);

  res.json({
    token,
    user: {
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      public_emergency_id: user.public_emergency_id
    }
  });
});

// Register (simplified)
app.post('/api/auth/register', (req, res) => {
  const { full_name, email, password, role = 'patient' } = req.body;
  
  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password required' });
  }

  // Check if user exists
  if (db.users.findOne({ email: email.toLowerCase() })) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  // Create new user
  const newUser = db.users.create({
    full_name,
    email: email.toLowerCase(),
    password, // In real app, this would be hashed
    role,
    public_emergency_id: `EMG${Date.now().toString().slice(-3)}`
  });

  // Create session
  const token = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessions.set(token, {
    id: newUser._id,
    email: newUser.email,
    full_name: newUser.full_name,
    role: newUser.role,
    public_emergency_id: newUser.public_emergency_id
  });

  console.log(`✅ New Registration: ${newUser.full_name} (${newUser.email})`);

  res.status(201).json({
    token,
    user: {
      _id: newUser._id,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      public_emergency_id: newUser.public_emergency_id
    }
  });
});

// Get current user
app.get('/api/auth/me', simpleAuth, (req, res) => {
  const user = db.users.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    _id: user._id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    public_emergency_id: user.public_emergency_id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  });
});

// ================================
// USER PROFILE ROUTES
// ================================

// Get my profile
app.get('/api/user/me', simpleAuth, (req, res) => {
  const user = db.users.findById(req.user.id);
  const profile = db.healthProfiles.findOne({ user_id: req.user.id });
  
  res.json({ 
    user: user ? {
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      public_emergency_id: user.public_emergency_id
    } : null,
    profile: profile || null 
  });
});

// Update health profile
app.post('/api/user/me/health', simpleAuth, (req, res) => {
  const userId = req.user.id;
  const profileData = req.body;
  
  // Check if profile exists
  let profile = db.healthProfiles.findOne({ user_id: userId });
  
  if (!profile) {
    // Create new profile
    profile = db.healthProfiles.create({
      user_id: userId,
      public_emergency_id: req.user.public_emergency_id || `EMG${Date.now().toString().slice(-3)}`,
      ...profileData
    });
    console.log(`✅ Created health profile for: ${req.user.full_name}`);
  } else {
    // Update existing profile
    profile = db.healthProfiles.update({ user_id: userId }, profileData);
    console.log(`✅ Updated health profile for: ${req.user.full_name}`);
  }

  res.json(profile);
});

// Get public emergency ID
app.get('/api/user/me/public-id', simpleAuth, (req, res) => {
  const user = db.users.findById(req.user.id);
  res.json({ 
    public_emergency_id: user?.public_emergency_id || req.user.public_emergency_id 
  });
});

// ================================
// MEDICAL RECORDS ROUTES
// ================================

// Get records
app.get('/api/records', simpleAuth, (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const userRecords = db.medicalRecords.find({ user_id: req.user.id });
  
  // Simple pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedRecords = userRecords.slice(startIndex, endIndex);

  console.log(`📋 Retrieved ${paginatedRecords.length} records for: ${req.user.full_name}`);

  res.json({
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: userRecords.length
    },
    data: paginatedRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  });
});

// Get single record
app.get('/api/records/:id', simpleAuth, (req, res) => {
  const record = db.medicalRecords.findById(req.params.id);
  
  if (!record || record.user_id !== req.user.id) {
    return res.status(404).json({ message: 'Record not found' });
  }

  res.json(record);
});

// Create record
app.post('/api/records', simpleAuth, (req, res) => {
  const { title, description, type = 'other', visibility = 'private', tags = [] } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description required' });
  }

  const newRecord = db.medicalRecords.create({
    user_id: req.user.id,
    uploaded_by: req.user.id,
    title,
    description,
    type,
    date_of_visit: new Date(),
    files: [],
    tags: Array.isArray(tags) ? tags : [],
    verified_by_provider: req.user.role === 'provider',
    visibility
  });

  console.log(`✅ Created new record: "${title}" for ${req.user.full_name}`);

  res.status(201).json(newRecord);
});

// Update record
app.patch('/api/records/:id', simpleAuth, (req, res) => {
  const record = db.medicalRecords.findById(req.params.id);
  
  if (!record || record.user_id !== req.user.id) {
    return res.status(404).json({ message: 'Record not found' });
  }

  const updatedRecord = db.medicalRecords.update(req.params.id, req.body);
  console.log(`✅ Updated record: "${record.title}" for ${req.user.full_name}`);

  res.json(updatedRecord);
});

// Delete record
app.delete('/api/records/:id', simpleAuth, (req, res) => {
  const record = db.medicalRecords.findById(req.params.id);
  
  if (!record || record.user_id !== req.user.id) {
    return res.status(404).json({ message: 'Record not found' });
  }

  db.medicalRecords.delete(req.params.id);
  console.log(`✅ Deleted record: "${record.title}" for ${req.user.full_name}`);

  res.json({ message: 'Record deleted successfully' });
});

// ================================
// PUBLIC EMERGENCY ROUTES
// ================================

// Public emergency access
app.get('/api/public/e/:publicId', (req, res) => {
  const { publicId } = req.params;
  
  // Find user by public emergency ID
  const user = db.users.findOne({ public_emergency_id: publicId });
  if (!user) {
    return res.status(404).json({ message: 'Emergency data not found' });
  }

  // Get health profile
  const profile = db.healthProfiles.findOne({ user_id: user._id });
  
  // Log emergency access
  db.emergencyLogs.create({
    user_id: user._id,
    accessed_at: new Date(),
    method: 'qr',
    ip: req.ip || 'unknown',
    device_info: req.get('User-Agent') || '',
    data_returned: ['name', 'blood_group', 'allergies', 'emergency_contacts', 'medications']
  });

  console.log(`🚨 Emergency access: ${user.full_name} (${publicId})`);

  res.json({
    user: {
      full_name: user.full_name,
      phone: user.phone
    },
    health_profile: profile || {}
  });
});

// Direct emergency route (shorter URL)
app.get('/e/:publicId', (req, res) => {
  // Redirect to API route or serve emergency page
  const { publicId } = req.params;
  
  // Find user by public emergency ID
  const user = db.users.findOne({ public_emergency_id: publicId });
  if (!user) {
    return res.status(404).json({ message: 'Emergency data not found' });
  }

  // Get health profile
  const profile = db.healthProfiles.findOne({ user_id: user._id });
  
  // Calculate age if DOB is available
  let age = null;
  if (profile && profile.dob) {
    age = Math.floor((Date.now() - profile.dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  }

  // Log emergency access
  db.emergencyLogs.create({
    user_id: user._id,
    accessed_at: new Date(),
    method: 'qr',
    ip: req.ip || 'unknown',
    device_info: req.get('User-Agent') || '',
    data_returned: ['name', 'age', 'blood_group', 'allergies', 'emergency_contacts']
  });

  console.log(`🚨 Emergency access: ${user.full_name} (${publicId})`);

  res.json({
    public_id: publicId,
    name: user.full_name,
    age,
    blood_group: profile?.blood_group || 'Not specified',
    allergies: profile?.allergies || [],
    chronic_conditions: profile?.chronic_conditions || [],
    emergency_contacts: profile?.emergency_contacts || [],
    medications: profile?.medications || [],
    note: profile?.public_emergency_summary || 'No emergency summary provided'
  });
});

// ================================
// HEALTH CHECK & INFO
// ================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: 'DEMO',
    timestamp: new Date().toISOString(),
    available_endpoints: {
      auth: '/api/auth',
      user_profile: '/api/user', 
      medical_records: '/api/records',
      public_emergency: '/api/public/e/{id}',
      direct_emergency: '/e/{id}'
    },
    demo_users: Object.keys(demoCredentials).map(email => ({
      email,
      password: 'demo123',
      name: demoCredentials[email].name,
      role: demoCredentials[email].role
    }))
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    name: 'Swasthya Health Card API',
    mode: 'DEMO',
    version: '1.0.0',
    description: 'Demo version for hackathon presentation',
    auth_required: true,
    demo_credentials: {
      patient1: { email: 'rajesh@demo.com', password: 'demo123' },
      patient2: { email: 'priya@demo.com', password: 'demo123' },
      provider: { email: 'amit@demo.com', password: 'demo123' }
    }
  });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: err.message || 'Server error' });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    available_routes: {
      health: '/health',
      api_info: '/api',
      auth: '/api/auth/*',
      user: '/api/user/*',
      records: '/api/records/*',
      emergency: '/e/{public_id}'
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 DEMO SERVER RUNNING ON PORT ${PORT}`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/health`);
  console.log(`📋 API Info: http://localhost:${PORT}/api`);
  console.log(`🆘 Emergency Demo: http://localhost:${PORT}/e/EMG001`);
  console.log('');
  console.log('🎯 Ready for hackathon demo! Use the credentials above to login.');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down demo server...');
  server.close(() => {
    console.log('✅ Demo server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down demo server...');
  server.close(() => {
    console.log('✅ Demo server closed');
    process.exit(0);
  });
});
// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Basic middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS: allow frontend (allow multiple ports for development)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5174',
    'http://localhost:5173',
    'http://localhost:5178',  // Frontend configured port
    FRONTEND_URL
  ],
  credentials: true
}));

// Simple MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB || 'swasthya_health_card';

if (!MONGO_URI) {
  console.error('❌ MONGO_URI missing in .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  dbName: MONGO_DB
})
.then(() => {
  console.log(`✅ MongoDB connected successfully to database: ${MONGO_DB}`);
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err);
  process.exit(1);
});

// No Swagger for simplified version

// Mount routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/cards.routes'));
app.use('/api/records', require('./routes/records.routes'));
app.use('/api/files', require('./routes/files.routes'));
app.use('/api/public', require('./routes/public.routes'));

// Public emergency endpoints 
app.use('/', require('./routes/public.routes'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      auth: '/api/auth (login, register)',
      user_profile: '/api/user',
      medical_records: '/api/records',
      emergency_access: '/e/:id'
    }
  });
});

// Simple error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Server error';
  res.status(status).json({ message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});

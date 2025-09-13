const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('../../routes/auth.routes');
const cardsRoutes = require('../../routes/cards.routes');
const recordsRoutes = require('../../routes/records.routes');
const publicRoutes = require('../../routes/public.routes');

// Create test app
const createTestApp = () => {
  const app = express();

  // Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/user', cardsRoutes);
  app.use('/api/records', recordsRoutes);
  app.use('/api/public', publicRoutes);

  // Health endpoint
  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  // Error handler
  app.use((err, req, res, next) => {
    console.error('TEST_ERR', err);
    res.status(500).json({ message: err.message || 'Server error' });
  });

  return app;
};

module.exports = { createTestApp };
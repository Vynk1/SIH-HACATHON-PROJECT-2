// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authCtrl = require('../controller/auth.controller');
const authMiddleware = require('../middleware/auth');
const { validateRegistration, validateLogin, handleValidationErrors, sanitizeInput } = require('../middleware/validation');

// POST /api/auth/register - Register new user
router.post('/register', 
  sanitizeInput, 
  validateRegistration, 
  handleValidationErrors, 
  authCtrl.register
);

// POST /api/auth/login - Login user
router.post('/login', 
  sanitizeInput, 
  validateLogin, 
  handleValidationErrors, 
  authCtrl.login
);

// GET /api/auth/me - Get current user info (requires auth)
router.get('/me', authMiddleware(), authCtrl.me);

module.exports = router;

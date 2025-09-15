// middleware/validation.js
const { body, validationResult } = require('express-validator');
const validator = require('validator');

// Validation middleware for registration
const validateRegistration = [
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces'),
    
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters')
    .matches(/^[+]?[0-9\s-()]+$/)
    .withMessage('Please provide a valid phone number'),
    
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('role')
    .optional()
    .isIn(['patient', 'caregiver', 'provider', 'admin'])
    .withMessage('Invalid role specified'),
];

// Validation middleware for login
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ 
      message: errorMessages.join(', '),
      errors: errors.array() 
    });
  }
  next();
};

// Sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Basic sanitization without breaking normal characters
  const sanitizeField = (value) => {
    if (typeof value === 'string') {
      // Only trim whitespace and remove dangerous script tags
      return value.trim().replace(/<script[^>]*>.*?<\/script>/gi, '');
    }
    return value;
  };

  // Sanitize body (but skip password and email as they have their own validation)
  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      if (key !== 'password' && key !== 'email') {
        req.body[key] = sanitizeField(req.body[key]);
      } else if (key !== 'password') {
        // For email, just trim
        req.body[key] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
      }
    }
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
  sanitizeInput,
};
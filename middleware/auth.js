// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

function auth(requiredRoles = []) {
  return async (req, res, next) => {
    try {
      const header = req.headers['authorization'];
      if (!header) return res.status(401).json({ message: 'No token provided' });

      const token = header.split(' ')[1]; // "Bearer <token>"
      if (!token) return res.status(401).json({ message: 'Invalid token format' });

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(401).json({ message: 'User not found' });

      // Attach user
      req.user = { id: user._id, role: user.role, email: user.email, full_name: user.full_name };

      // Role-based access control
      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      }

      next();
    } catch (err) {
      console.error('AUTH_ERR', err.message);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
}

module.exports = auth;


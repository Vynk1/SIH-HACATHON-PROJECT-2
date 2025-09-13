// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

exports.register = async (req, res) => {
  try {
    const { full_name, email, phone, password, role = 'patient' } = req.body;
    if (!full_name || !email || !password) return res.status(400).json({ message: 'name, email and password required' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      full_name,
      email: email.toLowerCase(),
      phone,
      password: hash,
      role
    });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.status(201).json({ token, user: { _id: user._id, full_name: user.full_name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('REGISTER_ERR', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, user: { _id: user._id, full_name: user.full_name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('LOGIN_ERR', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    const userId = req.user && req.user.id ? req.user.id : req.user._id;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('ME_ERR', err);
    res.status(500).json({ message: 'Server error' });
  }
};

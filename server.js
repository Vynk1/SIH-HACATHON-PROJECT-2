// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

// middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// CORS: allow frontend or allow all for demo
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Rate limiters (optional)
const { authLimiter, generalLimiter } = require('./middleware/rateLimit');
if (authLimiter) app.use('/api/auth', authLimiter);
app.use(generalLimiter);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB || undefined;
if (!MONGO_URI) {
  console.error('MONGO_URI missing in .env');
  process.exit(1);
}
mongoose.connect(MONGO_URI, { dbName: MONGO_DB, useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });

// Mount routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/card.routes'));
app.use('/api/records', require('./routes/record.routes'));
app.use('/api/public', require('./routes/public.routes')); // e.g., /api/public/e/:id, /api/public/share/:token
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/files', require('./routes/files.routes'));

// Public emergency endpoints — if you prefer short urls like /e/:id, you can mount:
// app.use('/', require('./routes/public.routes')); // will expose /e/:id and /share/:token

// Static (optional) - serve uploads or client files if needed
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Basic error handler
app.use((err, req, res, next) => {
  console.error('UNHANDLED_ERR', err && err.stack ? err.stack : err);
  res.status(500).json({ message: err.message || 'Server error' });
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

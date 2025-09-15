// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminCtrl = require('../controller/admin.controller');
const auth = require('../middleware/auth');

// Admin endpoints (auth middleware should also verify role; controller double-checks)
router.get('/summary', auth(), adminCtrl.getSummary);
router.get('/users', auth(), adminCtrl.listUsers);
router.get('/access-logs', auth(), adminCtrl.listAccessLogs);

module.exports = router;

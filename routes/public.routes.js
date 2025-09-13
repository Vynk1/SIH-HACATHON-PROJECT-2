// routes/public.routes.js
const express = require('express');
const router = express.Router();
const pub = require('../controller/public.controller');

// Public emergency view (no auth)
router.get('/e/:publicId', pub.publicEmergencyView);

// Share token access (no auth)
router.get('/share/:token', pub.getSharedData);

module.exports = router;

// routes/card.routes.js
const express = require('express');
const router = express.Router();
const cardCtrl = require('../controllers/card.controller');
const auth = require('../middleware/auth');

router.get('/me', auth(), cardCtrl.getMyProfile);
router.post('/me/health', auth(), cardCtrl.upsertHealthProfile);
router.get('/me/public-id', auth(), cardCtrl.getMyPublicId);

module.exports = router;

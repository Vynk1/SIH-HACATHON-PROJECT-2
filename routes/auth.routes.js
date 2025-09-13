// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authCtrl = require('../controller/auth.controller');
const authMiddleware = require('../middleware/auth'); // should populate req.user

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/me', authMiddleware(), authCtrl.me);

module.exports = router;

// routes/record.routes.js
const express = require('express');
const router = express.Router();
const rec = require('../controllers/record.controller');
const auth = require('../middleware/auth');

// Create record (patient or provider)
router.post('/', auth(), rec.createRecord);

// list records (query params)
router.get('/', auth(), rec.listRecords);

// single record
router.get('/:id', auth(), rec.getRecord);

// update record
router.patch('/:id', auth(), rec.updateRecord);

// delete record
router.delete('/:id', auth(), rec.deleteRecord);

module.exports = router;

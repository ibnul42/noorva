const express = require('express');
const router = express.Router();
const { registerSuperAdmin, register } = require('../controllers/userController');

// POST /api/users/register-super
router.post('/register-super', registerSuperAdmin);

// POST /api/users/register (normal users)
router.post('/register', register);

module.exports = router;

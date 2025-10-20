const express = require('express');
const router = express.Router();
const { registerSuperAdmin, register, login, getMe, logout } = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

// POST /api/users/register-super
router.post('/register-super', registerSuperAdmin);

// POST /api/users/register (normal users)
router.post('/register', register);

// POST /api/users/login
router.post('/login', login);

// GET /api/users/me (protected)
router.get('/me', requireAuth, getMe);

// POST /api/users/logout
router.post('/logout', logout);

module.exports = router;

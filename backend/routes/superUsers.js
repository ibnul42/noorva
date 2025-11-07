const express = require('express')
const router = express.Router()
const { approveUserRequest, rejectUserRequest, getPendingUsers } = require('../controllers/superUserController')
const { requireAuth, requireRole } = require('../middleware/authMiddleware')

// approve or reject requesr /api/users/review/:userId/approve
router.post('/review/:userId/approve', requireAuth, requireRole('super-user'), approveUserRequest)
router.post('/review/:userId/reject', requireAuth, requireRole('super-user'), rejectUserRequest)

// GET /api/users/review/pending
router.get('/review/pending', requireAuth, requireRole('super-user'), getPendingUsers)

module.exports = router

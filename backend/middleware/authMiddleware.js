const { verifyToken } = require('../lib/auth')
const User = require('../models/User')
const { Error } = require('../lib/errors')

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token || (req.headers.authorization || '').replace('Bearer ', '')
    if (!token) return Error(res, 401, 'not authenticated')

    const payload = verifyToken(token)
    if (!payload) return Error(res, 401, 'invalid token')

    const user = await User.findById(payload.id)
    if (!user) return Error(res, 401, 'user not found')

    req.user = user
    return next()
  } catch (err) {
    return next(err)
  }
}

function requireRole(role) {
  return function (req, res, next) {
    const user = req.user
    if (!user) return Error(res, 401, 'not authenticated')
    if (user.role !== role) return Error(res, 403, 'forbidden')
    return next()
  }
}

function requireSystemAccess(systemKey) {
  return function (req, res, next) {
    const user = req.user
    if (!user) return Error(res, 401, 'not authenticated')
    if (!user.systemsAccess || !user.systemsAccess[systemKey]) return Error(res, 403, 'access denied')
    return next()
  }
}

module.exports = { requireAuth, requireRole, requireSystemAccess }

const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const TOKEN_EXP = '7d'

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXP })
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return null
  }
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    // secure should be true in production (requires HTTPS)
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}

module.exports = { signToken, verifyToken, cookieOptions }

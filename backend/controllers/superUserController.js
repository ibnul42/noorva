const { Error, handleError } = require("../lib/errors");
const User = require("../models/User");

// Super-user: approve a user's registration/request
const approveUserRequest = async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) return Error(res, 400, 'userId required')

    const user = await User.findById(userId)
    if (!user) return Error(res, 404, 'user not found')

    // mark verified
    user.isVerified = true

    // Grant only the requested permissions: copy true keys from requestedSystemsAccess
    if (user.requestedSystemsAccess && user.systemsAccess) {
      Object.keys(user.systemsAccess).forEach((k) => {
        // if user requested this system, grant it; otherwise keep existing value
        if (user.requestedSystemsAccess[k]) {
          user.systemsAccess[k] = true
        }
      })
      // clear requestedSystemsAccess after granting
      Object.keys(user.requestedSystemsAccess).forEach((k) => {
        user.requestedSystemsAccess[k] = false
      })
    }

    await user.save()

    const { passwordHash, ...safe } = user.toObject()
    return res.json(safe)
  } catch (err) {
    return handleError(res, err)
  }
}

// Super-user: reject a user's registration/request
const rejectUserRequest = async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) return Error(res, 400, 'userId required')

    const user = await User.findById(userId)
    if (!user) return Error(res, 404, 'user not found')

    // clear requested access and remove any granted permissions (reset systemsAccess)
    if (user.requestedSystemsAccess) {
      Object.keys(user.requestedSystemsAccess).forEach((k) => {
        user.requestedSystemsAccess[k] = false
      })
    }

    if (user.systemsAccess) {
      Object.keys(user.systemsAccess).forEach((k) => {
        user.systemsAccess[k] = false
      })
    }

    user.isVerified = false
    await user.save()

    return res.json({ ok: true })
  } catch (err) {
    return handleError(res, err)
  }
}

// Get pending users (under review)
// Supports pagination via ?page (1-based) and ?limit
const getPendingUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit || '50', 10)));
    const skip = (page - 1) * limit;

    // find users that are not verified and are regular users
    const filter = { isVerified: false, role: 'user' };
    const [items, total] = await Promise.all([
      User.find(filter).sort({ createdAt: 1 }).skip(skip).limit(limit).select('-passwordHash'),
      User.countDocuments(filter),
    ]);

    return res.json({ items, page, limit, total });
  } catch (err) {
    return handleError(res, err);
  }
}

module.exports = { approveUserRequest, rejectUserRequest, getPendingUsers };

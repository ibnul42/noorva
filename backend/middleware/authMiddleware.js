const { verifyToken } = require("../lib/auth");
const User = require("../models/User");
const { Error } = require("../lib/errors");

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = req.cookies?.token || authHeader.replace("Bearer", "").trim();

    console.log("TOKEN:",token)

    if (!token) return Error(res, 401, "Not authenticated");

    let payload;
    try {
      payload = jwt.verify(token);
    } catch (err) {
      return Error(res, 401, "Invalid token");
    }

    if (!payload?.id) return Error(res, 401, "Invalid token payload");

    const user = await User.findById(payload.id);
    if (!user) return Error(res, 401, "User not found");

    req.user = user;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    next(err);
  }
}

function requireRole(role) {
  return function (req, res, next) {
    const user = req.user;
    if (!user) return Error(res, 401, "not authenticated");
    if (user.role !== role) return Error(res, 403, "forbidden");
    return next();
  };
}

function requireSystemAccess(systemKey) {
  return function (req, res, next) {
    const user = req.user;
    if (!user) return Error(res, 401, "not authenticated");
    if (!user.systemsAccess || !user.systemsAccess[systemKey])
      return Error(res, 403, "access denied");
    return next();
  };
}

module.exports = { requireAuth, requireRole, requireSystemAccess };

const { Error, handleError } = require("../lib/errors");
const { signToken, verifyToken, cookieOptions } = require("../lib/auth");
const User = require("../models/User");

const registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    if (!email || !password || !username)
      return Error(res, 400, "email, username and password required");

    // check existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return Error(res, 409, "email already in use");

    // check existing username
    const existingUser = await User.findOne({
      username: username.toLowerCase(),
    });
    if (existingUser) return Error(res, 409, "username already in use");

    const user = new User({
      name,
      email,
      username: username.toLowerCase(),
      role: "super-user",
    });
    user.setPassword(password);
    await user.save();

    // return safe user object
    const { passwordHash, ...safe } = user.toObject();
    res.status(201).json(safe);
  } catch (err) {
    return handleError(res, err);
  }
};

const register = async (req, res) => {
  try {
    const { name, email, username, password, requestedSystems } = req.body;
    if (!email || !password || !username)
      return Error(res, 400, "email, username and password required");

    // check existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return Error(res, 409, "email already in use");

    // optional username uniqueness check
    if (username) {
      const existingUser = await User.findOne({
        username: username.toLowerCase(),
      });
      if (existingUser) return Error(res, 409, "username already in use");
    }

    const user = new User({
      name,
      email,
      username: username ? username.toLowerCase() : undefined,
      role: "user",
      isVerified: false,
    });

    // requestedSystems can be an array of keys or an object with booleans
    if (Array.isArray(requestedSystems)) {
      requestedSystems.forEach((key) => {
        if (user.requestedSystemsAccess && key in user.requestedSystemsAccess) {
          user.requestedSystemsAccess[key] = true;
        }
      });
    } else if (
      typeof requestedSystems === "object" &&
      requestedSystems !== null
    ) {
      Object.keys(requestedSystems).forEach((key) => {
        if (
          user.requestedSystemsAccess &&
          key in user.requestedSystemsAccess &&
          !!requestedSystems[key]
        ) {
          user.requestedSystemsAccess[key] = true;
        }
      });
    }

    user.setPassword(password);
    await user.save();

    // notify super-users here (left as TODO)
    // Respond minimally to the user; account requires super-user verification
    // Use 202 Accepted to indicate the request has been received and is under review
    res.status(202).json({ message: "under review" });
  } catch (err) {
    return handleError(res, err);
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username
    if (!identifier || !password)
      return Error(res, 400, "identifier and password required");

    const q = identifier.includes("@")
      ? { email: identifier }
      : { username: identifier.toLowerCase() };
    const user = await User.findOne(q);
    if (!user) return Error(res, 401, "invalid credentials");

    // only allow login for verified users
    if (!user.isVerified) return Error(res, 403, "account not verified");

    const valid = await user.validatePassword(password);
    if (!valid) return Error(res, 401, "invalid credentials");

    const { passwordHash, ...safe } = user.toObject();
    const token = signToken({ id: user._id, role: user.role });
    res.cookie("token", token, cookieOptions());
    return res.json(safe);
  } catch (err) {
    return handleError(res, err);
  }
};

const getMe = async (req, res) => {
  try {
    // check cookie first
    const token =
      req.cookies?.token ||
      (req.headers.authorization || "").replace("Bearer ", "");
    if (!token) return Error(res, 401, "not authenticated");

    const payload = verifyToken(token);
    if (!payload) return Error(res, 401, "invalid token");

    const user = await User.findById(payload.id);
    if (!user) return Error(res, 404, "user not found");

    const { passwordHash, ...safe } = user.toObject();
    return res.json(safe);
  } catch (err) {
    return handleError(res, err);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ ok: true });
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = {
  registerSuperAdmin,
  register,
  login,
  getMe,
  logout,
};

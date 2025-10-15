const { Error, handleError } = require("../lib/errors");
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

module.exports = { registerSuperAdmin, register };

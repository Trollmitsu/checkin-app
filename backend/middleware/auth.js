// backend/middleware/auth.js

const jwt = require("jsonwebtoken");

/**
 * Verifierar att requesten har en giltig Bearer-token i Authorization-headern.
 * Om ja: fäster payload (userId + role) på req.user, och next().
 * Om nej: returnerar 401.
 */
module.exports = function verifyToken(req, res, next) {
  // Hämta header: "Bearer <token>"
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid Authorization format" });
  }

  const token = parts[1];
  try {
    // Verifiera och dekryptera
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Fäst användarinfo på req.user
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

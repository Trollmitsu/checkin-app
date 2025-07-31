// backend/routes/auth.js
const express  = require("express");
const router   = express.Router();
const jwt      = require("jsonwebtoken");
const bcrypt   = require("bcryptjs");
const User     = require("../models/User");

// 🟢 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, active: true });
  if (!user) return res.status(404).json({ error: "Användare hittades inte eller är inaktiv" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Fel lösenord" });

  // Sign JWT with userId, name and role
  const token = jwt.sign(
    { userId: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token, userId: user._id, role: user.role });
});

// 🟢 Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "E-post redan registrerad" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role, active: true });
  await newUser.save();
  res.json({ message: "Användare skapad!", user: newUser });
});

module.exports = router;

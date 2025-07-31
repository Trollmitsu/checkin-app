// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  getUserByEmail,
  createUser,
} = require("../models/User");

// 🔐 Inloggning
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email);

  if (!user || !user.active)
    return res.status(404).json({ error: "Användare hittades inte eller är inaktiv" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Fel lösenord" });

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  res.json({ token, userId: user.id, role: user.role });
});

// 🆕 Registrera ny användare
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = getUserByEmail(email);
  if (existing) return res.status(400).json({ error: "E-post redan registrerad" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = createUser({ name, email, password: hashedPassword, role });

  res.json({ message: "Användare skapad!", user: newUser });
});

module.exports = router;

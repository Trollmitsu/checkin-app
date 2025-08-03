// checkin-app/backend/routes/auth.js
const express = require("express");
const bcrypt  = require("bcrypt");
const jwt     = require("jsonwebtoken");
const db      = require("../db");         // din sqlite-anslutning
const router  = express.Router();

// ----- REGISTER (om du vill behålla) -----
router.post("/register", async (req, res) => {
  const { name, email, password, role = "user" } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email och password krävs" });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      [name, email, hash, role],
      function(err) {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ id: this.lastID, name, email, role });
      }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ----- LOGIN -----
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Grundläggande validering
  if (!email || !password) {
    return res.status(400).json({ message: "Email och password krävs" });
  }

  // Hämta användaren från databasen
  db.get(
    `SELECT id, name, email, password, role FROM users WHERE email = ?`,
    [email],
    async (err, user) => {
      if (err) {
        console.error("DB ERROR @ /login:", err);
        return res.status(500).json({ message: "Database error" });
      }
      if (!user) {
        return res.status(401).json({ message: "Felaktiga inloggningsuppgifter" });
      }

      try {
        // Jämför plaintext-lösenord mot hash
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({ message: "Felaktiga inloggningsuppgifter" });
        }

        // Skapa JWT med userId + role
        const token = jwt.sign(
          { userId: user.id, role: user.role, name: user.name },
          process.env.JWT_SECRET,
          { expiresIn: "8h" }
        );

        // Skicka tillbaka token + användarinfo
        res.json({
          token,
          user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
      } catch (errCompare) {
        console.error("BCRYPT ERROR @ /login:", errCompare);
        res.status(500).json({ message: "Authentication error" });
      }
    }
  );
});

module.exports = router;

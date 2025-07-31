// checkin-app/backend/server.js
const express       = require("express");
const cors          = require("cors");
const dotenv        = require("dotenv");
const path          = require("path");
const sqlite3       = require("sqlite3").verbose();
const authRoutes    = require("./routes/auth");
const userRoutes    = require("./routes/users");
const verifyToken   = require("./middleware/auth"); // your JWT middleware

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 8000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // if you serve videos/images

// ─── AUTH ROUTES (public) ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ─── USER ROUTES (protected) ─────────────────────────────────────────────────
app.use("/api/users", verifyToken, userRoutes);

// ─── SQLITE SETUP ─────────────────────────────────────────────────────────────
const dbPath = path.join(__dirname, "checkins.db");
const db     = new sqlite3.Database(dbPath, err => {
  if (err) console.error("❌ SQLite error:", err);
  else     console.log("✅ SQLite connected:", dbPath);
});

// Ensure table exists
db.run(`
  CREATE TABLE IF NOT EXISTS checkins (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    timestamp TEXT    NOT NULL
  )
`);

// ─── CHECK-IN ROUTES (protected) ──────────────────────────────────────────────

// 1) All check-ins (admin)
app.get("/api/checkin", verifyToken, (req, res) => {
  db.all(
    "SELECT * FROM checkins ORDER BY timestamp DESC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// 2) Only the logged-in user’s own check-ins
app.get("/api/checkin/me", verifyToken, (req, res) => {
  // We signed the JWT with { name: user.name, ... }
  const userName = req.user.name;
  db.all(
    "SELECT * FROM checkins WHERE name = ? ORDER BY timestamp DESC",
    [userName],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// 3) Create a new check-in (admin or self)
app.post("/api/checkin", verifyToken, (req, res) => {
  const { name, timestamp } = req.body;
  if (!name || !timestamp) {
    return res.status(400).json({ message: "Name & timestamp required" });
  }

  // Prevent multiple same-day check-ins
  const dateOnly = timestamp.split("T")[0];
  db.get(
    "SELECT 1 FROM checkins WHERE name = ? AND DATE(timestamp) = ?",
    [name, dateOnly],
    (err, row) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (row) return res.status(400).json({ message: "Already checked in today" });

      db.run(
        "INSERT INTO checkins (name, timestamp) VALUES (?, ?)",
        [name, timestamp],
        function (err) {
          if (err) return res.status(500).json({ message: "Insert error" });
          // Log to console
          console.log(`📌 Incheckad: ${name} @ ${timestamp}`);
          res.json({ id: this.lastID, name, timestamp });
        }
      );
    }
  );
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Backend-server körs på http://localhost:${PORT}`);
});

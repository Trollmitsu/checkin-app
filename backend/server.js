// server.js
const express   = require("express");
const mongoose  = require("mongoose");
const sqlite3   = require("sqlite3").verbose();
const { Parser }= require("json2csv");
const cors      = require("cors");
const dotenv    = require("dotenv");
const path      = require("path");

dotenv.config();
const app  = express();
const PORT = process.env.PORT || 8000;

// ─── Middleware ──────────────────────────────────────────────────
app.use(cors());
app.use(express.json()); // parse application/json

// ─── 1) MongoDB: Auth & Users ───────────────────────────────────
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology:true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

// mount existing routes
app.use("/api/auth",  require("./routes/auth"));
app.use("/api/users", require("./routes/users"));

// ─── 2) SQLite: Checkins ──────────────────────────────────────────
const dbPath = path.join(__dirname, "checkins.db");
const db     = new sqlite3.Database(dbPath);
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);
});

// GET all checkins
app.get("/api/checkin", (req, res) => {
  db.all("SELECT * FROM checkins ORDER BY timestamp DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new checkin (max 1 per person per calendar-day)
app.post("/api/checkin", (req, res) => {
  const { name, timestamp } = req.body;
  if (!name || !timestamp) {
    return res.status(400).json({ message: "Name and timestamp required" });
  }

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  db.get(
    "SELECT 1 FROM checkins WHERE name = ? AND DATE(timestamp) = ?",
    [name, today],
    (err, row) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (row) {
        return res.status(400).json({ message: "Already checked in today." });
      }
      db.run(
        "INSERT INTO checkins (name, timestamp) VALUES (?, ?)",
        [name, timestamp],
        function(err) {
          if (err) return res.status(500).json({ message: "Insert error" });
          console.log(`📌 Incheckad: ${name} @ ${timestamp}`);
          res.status(200).json({ id: this.lastID, name, timestamp });
        }
      );
    }
  );
});

// GET CSV-export
app.get("/api/checkin/export", (req, res) => {
  db.all("SELECT * FROM checkins ORDER BY timestamp DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const fields = ["id", "name", "timestamp"];
    const parser = new Parser({ fields });
    const csv    = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("checkins.csv");
    res.send(csv);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend-server körs på http://localhost:${PORT}`);
});

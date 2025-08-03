// checkin-app/backend/routes/checkin.js
const express = require("express");
const router  = express.Router();
const db      = require("../db");

// 1) Alla incheckningar (admin)
router.get("/", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Behörighet saknas" });
  }
  db.all(
    "SELECT * FROM checkins ORDER BY timestamp DESC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// 2) Egna incheckningar
router.get("/me", (req, res) => {
  const name = req.user.name;
  db.all(
    "SELECT * FROM checkins WHERE name = ? ORDER BY timestamp DESC",
    [name],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// 3) Skapa incheckning
router.post("/", (req, res) => {
  const { name, timestamp } = req.body;
  if (!name || !timestamp) {
    return res.status(400).json({ message: "Name & timestamp required" });
  }

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
          console.log(`📌 Incheckad: ${name} @ ${timestamp}`);
          res.json({ id: this.lastID, name, timestamp });
        }
      );
    }
  );
});

module.exports = router;

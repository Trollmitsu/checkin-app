// checkin-app/backend/db.js
const sqlite3 = require("sqlite3").verbose();
const path    = require("path");

// Sätt sökvägen till din SQLite-fil
const dbPath  = path.join(__dirname, "checkins.db");

// Initiera databasen
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error("❌ SQLite error:", err);
  } else {
    console.log("✅ SQLite connected:", dbPath);
  }
});

// ─── Skapa tabeller ────────────────────────────────────────────────────────────
// 1) checkins
db.run(`
  CREATE TABLE IF NOT EXISTS checkins (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    timestamp TEXT    NOT NULL
  )
`);

// 2) users
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    UNIQUE NOT NULL,
    password    TEXT    NOT NULL,
    role        TEXT    NOT NULL DEFAULT 'user',
    created_at  TEXT    DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;

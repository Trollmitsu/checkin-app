// migrate.js
const sqlite3 = require("sqlite3").verbose();
const path    = require("path");
const dbPath  = path.join(__dirname, "checkins.db");
const db      = new sqlite3.Database(dbPath, err => {
  if (err) return console.error("❌ DB:", err);
  console.log("✅ Connected to", dbPath);
});

db.run(
  "ALTER TABLE users ADD COLUMN face_image TEXT",
  (err) => {
    if (err && !/duplicate/.test(err.message)) {
      console.error("❌ ALTER TABLE:", err);
    } else if (!err) {
      console.log("✅ Kolumn face_image skapad");
    } else {
      console.log("ℹ️ Kolumn face_image finns redan");
    }
    db.close();
  }
);

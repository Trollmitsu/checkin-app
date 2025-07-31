// routes/checkin.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Valfritt: logga till en lokal fil också
const logFilePath = path.join(__dirname, "../checkin-log.json");

// 🟢 POST /api/checkin
router.post("/", async (req, res) => {
  const { name, timestamp } = req.body;

  if (!name || !timestamp) {
    return res.status(400).json({ error: "Både namn och tid krävs." });
  }

  const entry = { name, timestamp };

  // Skriv till loggfil (valfritt, som lokal backup)
  try {
    let log = [];
    if (fs.existsSync(logFilePath)) {
      const data = fs.readFileSync(logFilePath);
      log = JSON.parse(data);
    }

    log.push(entry);
    fs.writeFileSync(logFilePath, JSON.stringify(log, null, 2));
  } catch (err) {
    console.error("❌ Kunde inte skriva till loggfil:", err);
  }

  console.log(`✅ Incheckad: ${name} vid ${timestamp}`);
  res.status(200).json({ message: "Incheckning mottagen!", entry });
});

module.exports = router;

// routes/videoUpload.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Skapa mappen om den inte finns
const UPLOAD_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const userId = req.body.userId || "unknown";
    cb(null, `${userId}-${timestamp}.webm`);
  },
});

const upload = multer({ storage });

// POST: spara video
router.post("/", upload.single("video"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "Ingen video bifogad" });

  res.json({ message: "🎥 Video sparad", path: file.filename });
});

module.exports = router;

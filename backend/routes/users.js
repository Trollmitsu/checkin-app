// checkin-app/backend/routes/users.js
const express    = require("express");
const bcrypt     = require("bcrypt");
const multer     = require("multer");
const path       = require("path");
const { verifyToken, isAdmin } = require("../middleware/auth");
const db         = require("../db");

const router = express.Router();

// Multer för ansiktsbilder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../python-checkin/known_faces_fixed"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ok = ["image/png","image/jpeg"].includes(file.mimetype);
    cb(ok ? null : new Error("Endast PNG/JPG"), ok);
  },
});

// Hämta alla användare
router.get("/", verifyToken, isAdmin, (req, res) => {
  db.all(
    `SELECT id,name,email,role,face_image AS faceImage FROM users`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows);
    }
  );
});

// Skapa ny användare
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("faceImage"),
  async (req, res) => {
    const { name, email, password, role="user" } = req.body;
    if (!name||!email||!password||!req.file) {
      return res.status(400).json({
        message: "Name, email, password & faceImage krävs"
      });
    }
    try {
      const hash = await bcrypt.hash(password, 10);
      db.run(
        `INSERT INTO users (name,email,password,role,face_image)
         VALUES (?,?,?,?,?)`,
        [name,email,hash,role,req.file.filename],
        function(err) {
          if (err) return res.status(500).json({ message: err.message });
          res.status(201).json({
            id: this.lastID,
            name,email,role,faceImage: req.file.filename
          });
        }
      );
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// --- Uppdatera användare ---
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("faceImage"),
  async (req, res) => {
    console.log(
      `DEBUG PUT /api/users/${req.params.id}`,
      "body=", req.body,
      "file=", req.file && req.file.filename
    );
    const { name, email, password, role } = req.body;
    const fields = [], values = [];

    if (name)   { fields.push("name = ?");       values.push(name); }
    if (email)  { fields.push("email = ?");      values.push(email); }
    if (role)   { fields.push("role = ?");       values.push(role); }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      fields.push("password = ?");
      values.push(hash);
    }
    if (req.file) {
      fields.push("face_image = ?");
      values.push(req.file.filename);
    }

    if (!fields.length) {
      return res.status(400).json({ message: "Minst ett fält krävs" });
    }

    values.push(req.params.id);
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    db.run(sql, values, function(err) {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ message: err.message });
      }
      db.get(
        `SELECT id,name,email,role,face_image AS faceImage
         FROM users WHERE id = ?`,
        [req.params.id],
        (err, user) => {
          if (err) {
            console.error("DB get error:", err);
            return res.status(500).json({ message: err.message });
          }
          console.log("DEBUG Updated user:", user);
          res.json(user);
        }
      );
    });
  }
);

// Radera användare
router.delete("/:id", verifyToken, isAdmin, (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "User deleted" });
  });
});

module.exports = router;

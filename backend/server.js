// checkin-app/backend/server.js
const express       = require("express");
const cors          = require("cors");
const dotenv        = require("dotenv");
const path          = require("path");
const authRoutes    = require("./routes/auth");
const userRoutes    = require("./routes/users");
const checkinRoutes = require("./routes/checkin");
const { verifyToken, isAdmin } = require("./middleware/auth");
const db            = require("./db");

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 8000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 
// Serva ansiktsbilderna från python-appens mapp:
app.use(
  "/known_faces",
  express.static(path.join(__dirname, "python-checkin", "known_faces_fixed"))
);

// ─── AUTH ROUTES (public) ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ─── USER ROUTES (protected) ─────────────────────────────────────────────────
app.use("/api/users", verifyToken, userRoutes);

// ─── CHECK-IN ROUTES (protected) ──────────────────────────────────────────────
app.use("/api/checkin", verifyToken, checkinRoutes);

// ─── HEALTHCHECK (valfritt) ───────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Backend-server körs på http://localhost:${PORT}`);
  console.log(`🗂️  Bilder servas på http://localhost:${PORT}/known_faces/<filnamn>`);
});

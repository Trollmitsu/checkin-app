// routes/users.js
const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deactivateUser,
  reactivateUser,
  deleteUser,
} = require("../models/User");

// 🔹 Hämta alla användare
router.get("/", (req, res) => {
  res.json(getAllUsers());
});

// 🔹 Hämta en användare
router.get("/:id", (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "Användare hittades inte" });
  res.json(user);
});

// 🔹 Skapa ny användare
router.post("/", (req, res) => {
  const { name, email, password, role, startTime } = req.body;
  const newUser = createUser({ name, email, password, role, startTime });
  res.json(newUser);
});

// 🔹 Uppdatera användare
router.put("/:id", (req, res) => {
  const updated = updateUser(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Användare hittades inte" });
  res.json(updated);
});

// 🔹 Inaktivera användare
router.put("/:id/deactivate", (req, res) => {
  const user = deactivateUser(req.params.id);
  if (!user) return res.status(404).json({ error: "Användare hittades inte" });
  res.json(user);
});

// 🔹 Återaktivera användare
router.put("/:id/reactivate", (req, res) => {
  const user = reactivateUser(req.params.id);
  if (!user) return res.status(404).json({ error: "Användare hittades inte" });
  res.json(user);
});

// 🔹 "Soft delete"
router.delete("/:id", (req, res) => {
  const user = deleteUser(req.params.id);
  if (!user) return res.status(404).json({ error: "Användare hittades inte" });
  res.json({ message: "Användare raderad (soft delete)", user });
});

// 🔹 Hämta schema
router.get("/:id/schedule", (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "Användare hittades inte" });
  res.json({ startTime: user.startTime });
});

module.exports = router;

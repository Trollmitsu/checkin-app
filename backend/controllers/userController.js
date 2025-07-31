const User = require("../models/User");

// 🔁 Hämta alla användare
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Kunde inte hämta användare" });
  }
};

// ➕ Skapa ny användare
exports.createUser = async (req, res) => {
  const { name, email, password, role, startTime } = req.body;
  try {
    const newUser = new User({
      name,
      email,
      password,
      role,
      startTime,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Kunde inte skapa användare" });
  }
};

// ✏️ Uppdatera användare (schema, namn osv)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, startTime } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      id,
      { name, email, role, startTime },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Kunde inte uppdatera användare" });
  }
};

// ⛔ Inaktivera användare
exports.deactivateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: "Användare inaktiverad" });
  } catch (err) {
    res.status(500).json({ message: "Kunde inte inaktivera" });
  }
};

// ✅ Återaktivera
exports.reactivateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { active: true });
    res.json({ message: "Användare återaktiverad" });
  } catch (err) {
    res.status(500).json({ message: "Kunde inte återaktivera" });
  }
};

// 🗑 Radera användare (soft delete: markeras som borttagen)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: "Användare raderad (soft delete)" });
  } catch (err) {
    res.status(500).json({ message: "Kunde inte radera användare" });
  }
};

// 🕘 Hämta schema för användare
exports.getSchedule = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Användare hittades inte" });
    res.json({ startTime: user.startTime });
  } catch (err) {
    res.status(500).json({ message: "Fel vid hämtning av schema" });
  }
};

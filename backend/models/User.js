// models/User.js

let users = []; // All users will be stored here in memory
let nextId = 1; // Auto-increment ID

function getAllUsers() {
  return users;
}

function getUserById(id) {
  return users.find(u => u.id === parseInt(id));
}

function getUserByEmail(email) {
  return users.find(u => u.email === email);
}

function createUser(data) {
  const newUser = {
    id: nextId++,
    name: data.name,
    email: data.email,
    password: data.password, // assumed hashed already
    role: data.role || "employee",
    active: true,
    startTime: data.startTime || "09:00",
  };
  users.push(newUser);
  return newUser;
}

function updateUser(id, updates) {
  const user = getUserById(id);
  if (!user) return null;
  Object.assign(user, updates);
  return user;
}

function deactivateUser(id) {
  const user = getUserById(id);
  if (!user) return null;
  user.active = false;
  return user;
}

function reactivateUser(id) {
  const user = getUserById(id);
  if (!user) return null;
  user.active = true;
  return user;
}

function deleteUser(id) {
  return deactivateUser(id); // Soft delete = just deactivate
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deactivateUser,
  reactivateUser,
  deleteUser,
};

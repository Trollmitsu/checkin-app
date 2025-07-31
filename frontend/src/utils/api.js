// src/utils/api.js

// Hämtar alla incheckningar (protected)
export async function fetchCheckins() {
  const token = localStorage.getItem("token");
  const res   = await fetch("http://localhost:8000/api/checkin", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Couldn’t fetch checkins: " + res.statusText);
  return res.json();
}

// Hämtar alla användare (protected)
export async function fetchUsers() {
  const token = localStorage.getItem("token");
  const res   = await fetch("http://localhost:8000/api/users", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Couldn’t fetch users: " + res.statusText);
  return res.json();
}

// Skapar en incheckning (protected)
export async function postCheckin(name) {
  const token = localStorage.getItem("token");
  const res   = await fetch("http://localhost:8000/api/checkin", {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name, timestamp: new Date().toISOString() })
  });
  if (!res.ok) throw new Error("Couldn’t post checkin: " + res.statusText);
  return res.json();
}

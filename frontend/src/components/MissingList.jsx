// src/components/MissingList.jsx
import React, { useEffect, useState } from "react";
import { fetchUsers, fetchCheckins }        from "../utils/api.js";

export default function MissingList() {
  const [users,    setUsers]    = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [error,    setError]    = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [u, c] = await Promise.all([fetchUsers(), fetchCheckins()]);
        setUsers(u);
        setCheckins(c);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  // Build a Set of names that have checked in today
  const today = new Date().toISOString().split("T")[0];
  const presentToday = new Set(
    checkins
      .filter(ci => ci.timestamp.startsWith(today))
      .map(ci => ci.name)
  );

  // All active users who are NOT in presentToday
  const missing = users
    .filter(u => u.active)
    .filter(u => !presentToday.has(u.name));

  if (!missing.length) return <p>Everyone’s checked in!</p>;

  return (
    <ul>
      {missing.map(u => (
        <li key={u.id}>
          {u.name} ({u.role})
        </li>
      ))}
    </ul>
  );
}

// frontend/src/components/MissingList.jsx
import React, { useEffect, useState } from "react";
import { fetchUsers, fetchCheckins }      from "../utils/api";

export default function MissingList() {
  // State för saknade användare
  const [missing, setMissing] = useState([]);

  useEffect(() => {
    async function load() {
      // Hämta users + checkins från backend
      const [users, checkins] = await Promise.all([
        fetchUsers(),
        fetchCheckins()
      ]);

      // Gör en set med de som redan är incheckade
      const presentNames = new Set(checkins.map(c => c.name));

      // Filtrera ut de som är aktiva men inte incheckade
      const missingUsers = users
        .filter(u => u.active)                   // bara aktiva
        .filter(u => !presentNames.has(u.name)); // inte incheckade

      setMissing(missingUsers);
    }

    load();
    // Upprepa var 30:e sekund för live-uppdatering
    const intervalId = setInterval(load, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Om ingen är saknad
  if (missing.length === 0) {
    return <p>🎉 All active users are checked in!</p>;
  }

  // Annars lista
  return (
    <div>
      <h2>🚫 Missing List</h2>
      <ul>
        {missing.map(u => (
          <li key={u._id || u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}

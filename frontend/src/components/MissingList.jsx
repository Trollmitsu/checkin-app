// src/components/MissingList.jsx
import React, { useState, useEffect } from "react";
import { getToken } from "../utils/auth.js";

export default function MissingList() {
  const [missing, setMissing] = useState([]);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchMissing = async () => {
      try {
        const token = getToken();

        // 1) Hämta alla användare
        const usersRes = await fetch("http://localhost:8000/api/users", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (usersRes.status === 401) {
          throw new Error("Unauthorized – kontrollera din token");
        }
        if (!usersRes.ok) {
          throw new Error(`Fetch users error: ${usersRes.status}`);
        }
        const users = await usersRes.json();

        // 2) Hämta dagens incheckningar
        const checkinRes = await fetch("http://localhost:8000/api/checkin", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (checkinRes.status === 401) {
          throw new Error("Unauthorized – kontrollera din token");
        }
        if (!checkinRes.ok) {
          throw new Error(`Fetch checkin error: ${checkinRes.status}`);
        }
        const checkins = await checkinRes.json();

        // 3) Filtrera ut de som inte är incheckade
        const checkedNames = new Set(checkins.map((c) => c.name));
        const missingList  = users.filter((u) => !checkedNames.has(u.name));

        setMissing(missingList);
      } catch (err) {
        console.error("Error: Couldn't fetch users or checkins:", err);
        setError(err.message);
      }
    };
    fetchMissing();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  if (missing.length === 0) {
    return <p>Alla har checkat in!</p>;
  }

  return (
    <ul>
      {missing.map((u) => (
        <li key={u.id}>
          {u.name} ({u.email})
        </li>
      ))}
    </ul>
  );
}

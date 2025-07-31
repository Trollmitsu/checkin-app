// checkin-app/frontend/src/pages/MyProfile.jsx
import React, { useEffect, useState } from "react";
import { getToken } from "../utils/auth.js";
import LogoutButton from "../components/LogoutButton.jsx";

export default function MyProfile() {
  const [history, setHistory] = useState([]);
  const [error,   setError]   = useState("");

  useEffect(() => {
    async function loadMyCheckins() {
      try {
        const token = getToken();
        const res   = await fetch("http://localhost:8000/api/checkin/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
        setHistory(await res.json());
      } catch (err) {
        setError(err.message);
      }
    }
    loadMyCheckins();
  }, []);

  return (
    <div style={{ padding: 16, position: "relative" }}>
      <LogoutButton style={{ position: "absolute", top: 16, right: 16 }} />
      <h1>My Attendance</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && history.length === 0 && (
        <p>You haven’t checked in yet.</p>
      )}
      <ul>
        {history.map(entry => (
          <li key={entry.id}>
            {new Date(entry.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

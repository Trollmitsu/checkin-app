// src/components/PresentList.jsx
import React, { useState, useEffect } from "react";
import { getToken } from "../utils/auth.js";

export default function PresentList() {
  const [present, setPresent] = useState([]);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchPresent = async () => {
      try {
        const token = getToken();
        const res = await fetch("http://localhost:8000/api/checkin", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.status === 401) {
          throw new Error("Unauthorized – kontrollera din token");
        }
        if (!res.ok) {
          throw new Error(`Fetch error: ${res.status}`);
        }
        const data = await res.json();
        setPresent(data);
      } catch (err) {
        console.error("Error: Couldn't fetch checkins:", err);
        setError(err.message);
      }
    };
    fetchPresent();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  if (present.length === 0) {
    return <p>Inga incheckningar än idag.</p>;
  }

  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-2 py-1 border">Namn</th>
          <th className="px-2 py-1 border">Tid</th>
        </tr>
      </thead>
      <tbody>
        {present.map((c) => (
          <tr key={c.id}>
            <td className="px-2 py-1 border">{c.name}</td>
            <td className="px-2 py-1 border">
              {new Date(c.timestamp).toLocaleTimeString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

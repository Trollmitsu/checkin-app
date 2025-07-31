// src/components/PresentList.jsx
import React, { useEffect, useState } from "react";
import { fetchCheckins } from "../utils/api.js";

export default function PresentList() {
  const [checkins, setCheckins] = useState([]);
  const [error,    setError]    = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCheckins();
        setCheckins(data);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!checkins.length) return <p>No one has checked in yet.</p>;

  return (
    <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {checkins.map(({ id, name, timestamp }) => (
          <tr key={id}>
            <td>{id}</td>
            <td>{name}</td>
            <td>{new Date(timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

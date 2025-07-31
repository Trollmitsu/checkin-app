// src/components/ExportCSVButton.jsx
import React from "react";
import { fetchCheckins } from "../utils/api.js";

export default function ExportCSVButton({ style }) {
  async function handleExport() {
    const data = await fetchCheckins();
    const csv  = [
      ["ID","Name","Timestamp"],
      ...data.map(({id,name,timestamp}) => [id,name,timestamp])
    ]
      .map(row => row.map(val => `"${val}"`).join(","))
      .join("\n");

    // Trigger download
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "checkins.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button onClick={handleExport} style={style}>
      Export CSV
    </button>
  );
}

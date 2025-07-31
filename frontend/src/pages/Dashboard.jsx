// src/pages/Dashboard.jsx
import React, { useState } from "react";
import PresentList     from "../components/PresentList.jsx";
import MissingList     from "../components/MissingList.jsx";
import ExportCSVButton from "../components/ExportCSVButton.jsx";
import LogoutButton   from "../components/LogoutButton.jsx";

export default function Dashboard() {
  const [tab, setTab] = useState("present");

  return (
    <div style={{ padding: 16, position: "relative" }}>
      {/* top‐right logout */}
      <LogoutButton style={{ position: "absolute", top: 16, right: 16 }} />

      <h1>Admin Dashboard</h1>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setTab("present")}>Present</button>
        <button
          onClick={() => setTab("missing")}
          style={{ marginLeft: 8 }}
        >
          Missing
        </button>
        <ExportCSVButton style={{ marginLeft: 8 }} />
      </div>

      {tab === "present" ? <PresentList /> : <MissingList />}
    </div>
  );
}

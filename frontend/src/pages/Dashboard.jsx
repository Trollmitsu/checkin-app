// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import PresentList     from "../components/PresentList.jsx";
import MissingList     from "../components/MissingList.jsx";
import ExportCSVButton from "../components/ExportCSVButton.jsx";
import LogoutButton    from "../components/LogoutButton.jsx";

export default function Dashboard() {
  const [tab, setTab] = useState("present");

  return (
    <div style={{ padding: 16, position: "relative" }}>
      {/* Top-right logout */}
      <LogoutButton style={{ position: "absolute", top: 16, right: 16 }} />

      <h1>Admin Dashboard</h1>

      {/* Navigation to user management */}
      <div style={{ marginBottom: 16 }}>
        <Link to="/app/admin/users" style={{ marginRight: 16, textDecoration: "none", color: "#1D4ED8" }}>
          Hantera anställda
        </Link>
      </div>

      {/* Tab controls */}
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setTab("present")} style={{ marginRight: 8 }}>
          Present
        </button>
        <button
          onClick={() => setTab("missing")}
          style={{ marginLeft: 8 }}
        >
          Missing
        </button>
        <ExportCSVButton style={{ marginLeft: 8 }} />
      </div>

      {/* Render selected list */}
      {tab === "present" ? <PresentList /> : <MissingList />}
    </div>
  );
}

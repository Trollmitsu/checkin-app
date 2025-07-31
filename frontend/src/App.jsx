import React, { useState } from "react";
import PresentList      from "./components/PresentList";
import MissingList      from "./components/MissingList";
import ExportCSVButton  from "./components/ExportCSVButton";



export default function App() {
  const [tab, setTab] = useState("present");

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 16 }}>Admin Dashboard</h1>

      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => setTab("present")}
          style={{ marginRight: 8 }}
        >
          Present
        </button>

        <button onClick={() => setTab("missing")}>
          Missing
        </button>

        {/* Export-knappen */}
        <ExportCSVButton />
      </div>

      {/* Visa olika listor beroende på tab */}
      {tab === "present" ? <PresentList /> : <MissingList />}
    </div>
  );
}

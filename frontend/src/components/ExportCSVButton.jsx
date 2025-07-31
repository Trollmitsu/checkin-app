import React from "react";

export default function ExportCSVButton() {
  const handleClick = () => {
    // Öppnar en ny flik och laddar ner CSV-filen
    window.open("http://localhost:8000/api/checkin/export", "_blank");
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "8px 16px",
        backgroundColor: "#16a34a",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginLeft: "1rem"
      }}
    >
      📥 Export CSV
    </button>
  );
}

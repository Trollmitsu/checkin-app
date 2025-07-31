// src/components/LogoutButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ style }) {
  const nav = useNavigate();

  function handleLogout() {
    // Clear out token & role
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Send back to login
    nav("/login");
  }

  return (
    <button onClick={handleLogout} style={style}>
      Log out
    </button>
  );
}

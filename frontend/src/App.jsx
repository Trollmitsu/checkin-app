// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import Dashboard from "./pages/Dashboard";
import AdminUsersPage from "./pages/AdminUsersPage";
// ... andra sidor

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard route */}
        <Route path="/" element={<Dashboard />} />

        {/* Hantera anställda */}
        <Route path="/app/admin/users" element={<AdminUsersPage />} />

        {/* Lägg till nya routes här */}
      </Routes>
    </BrowserRouter>
  );
}

// src/components/Layout.jsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth.js";

export default function Layout() {
  const navigate = useNavigate();

  // Hämta användarnamn ur JWT
  let userName = "";
  const token = getToken();
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userName = payload.name;
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold">Check-In App</h2>
        </div>
        <nav className="mt-6">
          <NavLink
            to="/app/dashboard"
            className={({ isActive }) =>
              `block px-6 py-3 hover:bg-gray-200 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/app/me"
            className={({ isActive }) =>
              `block px-6 py-3 hover:bg-gray-200 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            Min profil
          </NavLink>
          <NavLink
            to="/app/admin/users"
            className={({ isActive }) =>
              `block px-6 py-3 hover:bg-gray-200 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            Hantera anställda
          </NavLink>
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex justify-between items-center bg-white shadow p-4">
          <div className="text-lg font-medium">Välkommen, {userName}</div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Logga ut
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

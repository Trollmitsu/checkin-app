// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login           from "./pages/Login.jsx";
import Dashboard       from "./pages/Dashboard.jsx";
import MyProfile       from "./pages/MyProfile.jsx";
import AdminUsersPage  from "./pages/AdminUsersPage.jsx";
import PrivateRoute    from "./components/PrivateRoute.jsx";
import Layout          from "./components/Layout.jsx";

import { isLoggedIn, getRole } from "./utils/auth.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}
  >
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/me"        element={<MyProfile />} />
          <Route path="/app/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={
          isLoggedIn()
            ? getRole()?.toLowerCase() === "admin"
              ? <Navigate to="/app/dashboard" replace />
              : <Navigate to="/app/me" replace />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  </BrowserRouter>
);

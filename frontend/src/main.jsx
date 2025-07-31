// checkin-app/frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login        from "./pages/Login.jsx";
import Dashboard    from "./pages/Dashboard.jsx";
import MyProfile    from "./pages/MyProfile.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

import { isLoggedIn, getRole } from "./utils/auth.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* All /app/* require auth */}
      <Route element={<PrivateRoute />}>
        {/* Employee self-view */}
        <Route path="/app/me"        element={<MyProfile />} />
        {/* Admin dashboard only */}
        <Route
          path="/app/dashboard"
          element={
            getRole() === "Admin"
              ? <Dashboard />
              : <Navigate to="/app/me" replace />
          }
        />
      </Route>

      {/* Catch-all */}
      <Route
        path="*"
        element={
          isLoggedIn()
            ? (getRole() === "Admin"
                ? <Navigate to="/app/dashboard" replace />
                : <Navigate to="/app/me"        replace />)
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  </BrowserRouter>
);

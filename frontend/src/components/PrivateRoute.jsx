// checkin-app/frontend/src/components/PrivateRoute.jsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { isLoggedIn }       from "../utils/auth.js";

export default function PrivateRoute() {
  return isLoggedIn()
    ? <Outlet />
    : <Navigate to="/login" replace />;
}

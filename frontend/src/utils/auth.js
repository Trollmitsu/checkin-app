// src/utils/auth.js

/** Get JWT token from localStorage */
export function getToken() {
  return localStorage.getItem("token");
}

/** Is a user logged in? */
export function isLoggedIn() {
  return Boolean(getToken());
}

/** Get the current user’s role */
export function getRole() {
  return localStorage.getItem("role");
}

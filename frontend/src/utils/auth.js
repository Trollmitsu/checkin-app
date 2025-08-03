// src/utils/auth.js

/**
 * Hämtar sparad JWT från localStorage
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.getItem("jwt");
}

/**
 * Returnerar true om användaren är inloggad (har en JWT)
 * @returns {boolean}
 */
export function isLoggedIn() {
  return !!getToken();
}

/**
 * Avkodar JWT-payload och returnerar rollen
 * @returns {string|null}
 */
export function getRole() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
}

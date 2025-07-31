// checkin-app/frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const nav                  = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Login failed");
      }
      const { token, role } = await res.json();
      localStorage.setItem("token", token);
      localStorage.setItem("role",  role);

      // Redirect based on role:
      if (role === "Admin") {
        nav("/app/dashboard");
      } else {
        nav("/app/me");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: "auto", padding: 16 }}>
      <h2>Log In</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email<br/>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          Password<br/>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 16 }}
          />
        </label>
        <button type="submit" style={{ width: "100%" }}>
          Log In
        </button>
      </form>
    </div>
  );
}

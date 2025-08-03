// src/components/NewEmployeeForm.jsx
import { useState } from "react";

export default function NewEmployeeForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    faceImage: null
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("📤 NewEmployeeForm submit, form:", form);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("password", form.password);
    fd.append("role", form.role);
    fd.append("faceImage", form.faceImage);

    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      console.log("⚙️ NewEmployeeForm POST status", res.status);
      const data = await res.json();
      console.log("⚙️ NewEmployeeForm response JSON", data);

      if (!res.ok) throw new Error(data.message || "Kunde inte skapa användare");
      onCreated();
      setForm({ name:"", email:"", password:"", role:"user", faceImage:null });
    } catch (err) {
      console.error("❌ NewEmployeeForm error:", err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow mb-6">
      <h3 className="text-lg mb-2">Ny anställd</h3>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Namn"
        required
        className="block w-full mb-2 p-2 border"
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="block w-full mb-2 p-2 border"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Lösenord"
        required
        className="block w-full mb-2 p-2 border"
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="block w-full mb-2 p-2 border"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <input
        name="faceImage"
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleChange}
        required
        className="block w-full mb-4"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Skapa anställd
      </button>
    </form>
  );
}

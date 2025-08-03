// src/components/EditEmployeeForm.jsx
import React, { useState } from "react";

export default function EditEmployeeForm({ user, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    password: "",
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
    console.log("📤 PUT /api/users/" + user.id, form);

    const fd = new FormData();
    if (form.name)     fd.append("name", form.name);
    if (form.email)    fd.append("email", form.email);
    if (form.role)     fd.append("role", form.role);
    if (form.password) fd.append("password", form.password);
    if (form.faceImage)fd.append("faceImage", form.faceImage);

    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      console.log("⚙️ status", res.status);
      const data = await res.json();
      console.log("⚙️ response", data);

      if (!res.ok) throw new Error(data.message || "Kunde inte uppdatera användare");
      onSaved(data);
    } catch (err) {
      console.error("❌ error:", err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow mb-6">
      <h3 className="text-lg mb-2">Redigera {user.name}</h3>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Namn"
        className="block w-full mb-2 p-2 border"
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
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
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Nytt lösenord (lämna tomt för oförändrat)"
        className="block w-full mb-2 p-2 border"
      />
      <input
        name="faceImage"
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleChange}
        className="block w-full mb-4"
      />
      <div className="flex space-x-2">
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
          Spara
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
          Avbryt
        </button>
      </div>
    </form>
  );
}

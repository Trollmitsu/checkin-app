// src/pages/AdminUsersPage.jsx
import React, { useState, useEffect } from "react";
import NewEmployeeForm   from "../components/NewEmployeeForm";
import EditEmployeeForm  from "../components/EditEmployeeForm";

export default function AdminUsersPage() {
  const [users, setUsers]             = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const token                        = localStorage.getItem("jwt");

  const fetchUsers = async () => {
    try {
      const res  = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log("✔️ fetched users:", data);
      setUsers(data);
    } catch (err) {
      console.error("❌ fetchUsers error:", err);
    }
  };

  useEffect(fetchUsers, []);

  const handleSaved = (updated) => {
    console.log("✔️ user saved:", updated);
    setEditingUser(null);
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl mb-4">Hantera anställda</h2>

      <NewEmployeeForm onCreated={fetchUsers} />

      {editingUser && (
        <EditEmployeeForm
          user={editingUser}
          onSaved={handleSaved}
          onCancel={() => setEditingUser(null)}
        />
      )}

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Bild</th>
              <th className="px-4 py-2">Namn</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Roll</th>
              <th className="px-4 py-2">Åtgärd</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b">
                <td className="px-4 py-2">
                  {u.faceImage
                    ? <img
                        src={`/known_faces/${u.faceImage}`}
                        alt={u.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    : <span className="text-gray-500">Ingen bild</span>
                  }
                </td>
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setEditingUser(u)}
                    className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                  >
                    Redigera
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

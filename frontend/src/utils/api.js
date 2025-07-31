export async function fetchCheckins() {
  const res = await fetch("http://localhost:8000/api/checkin");
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch("http://localhost:8000/api/users");
  return res.json();
}

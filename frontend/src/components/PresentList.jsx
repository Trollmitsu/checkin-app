import { useEffect, useState } from "react";
import { fetchCheckins } from "../utils/api";

export default function PresentList() {
  const [checkins, setCheckins] = useState([]);
  useEffect(() => {
    fetchCheckins().then(data => setCheckins(data));
    const id = setInterval(() => fetchCheckins().then(d=>setCheckins(d)), 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <div>
      <h2>Present List</h2>
      <ul>
        {checkins.map(ci => (
          <li key={ci.id}>
            {ci.name} — {new Date(ci.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

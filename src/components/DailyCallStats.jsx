"use client";

import { useState } from "react";

export default function DailyCallStats() {
  const [date, setDate] = useState("");
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    if (!date) return;
    setLoading(true);
    setError("");
    setStats([]);

    try {
      const res = await fetch(`/api/call-stats?date=${date}`);
      const data = await res.json();

      if (res.ok) setStats(data.stats || []);
      else setError(data.error || "Xatolik yuz berdi");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Kunlik operator statistikasi</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={fetchStats}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Yuklanmoqda..." : "Statistikani olish"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {stats.length > 0 && (
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Ism</th>
              <th className="border p-2">Familiya</th>
              <th className="border p-2">Kiruvchi</th>
              <th className="border p-2">Chiquvchi</th>
              <th className="border p-2">Umumiy daqiqa</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.user_id}>
                <td className="border p-2">{s.user_id}</td>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.surname}</td>
                <td className="border p-2">{s.incoming}</td>
                <td className="border p-2">{s.outgoing}</td>
                <td className="border p-2">{s.total_minutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

export default function PipelineStatusFetcher() {
  const [pipelineId, setPipelineId] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStatuses = async () => {
    if (!pipelineId) return;

    setLoading(true);
    setError("");
    setStatuses([]);

    try {
      const res = await fetch(
        `/api/get-pipeline-statuses?pipelineId=${pipelineId}`
      );
      const data = await res.json();

      if (res.ok) {
        setStatuses(data.statuses || []);
      } else {
        setError(data.error || "Xatolik yuz berdi");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-lg font-semibold mb-4">
        Pipeline Statuslarini olish
      </h2>

      <input
        type="text"
        placeholder="Pipeline ID kiriting"
        value={pipelineId}
        onChange={(e) => setPipelineId(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <button
        onClick={fetchStatuses}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Yuklanmoqda..." : "Statuslarni olish"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {statuses.length > 0 && (
        <ul className="mt-4 border-t pt-2">
          {statuses.map((status) => (
            <li key={status.id} className="py-1">
              <span className="font-medium">ID:</span> {status.id} |{" "}
              <span className="font-medium">Name:</span> {status.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

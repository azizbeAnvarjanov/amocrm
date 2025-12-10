"use client";

import { useEffect, useState } from "react";

export default function PipelinesAccordion() {
  const [pipelines, setPipelines] = useState([]);
  const [statusesMap, setStatusesMap] = useState({}); // pipelineId: [statuses]
  const [loadingPipelines, setLoadingPipelines] = useState(false);
  const [loadingStatuses, setLoadingStatuses] = useState({});
  const [error, setError] = useState("");

  // Barcha pipeline larni olish
  useEffect(() => {
    const fetchPipelines = async () => {
      setLoadingPipelines(true);
      try {
        const res = await fetch("/api/get-all-pipelines");
        const data = await res.json();
        if (res.ok) setPipelines(data.pipelines || []);
        else setError(data.error || "Pipeline larni olishda xatolik");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingPipelines(false);
      }
    };

    fetchPipelines();
  }, []);

  // Statuslarni olish
  const fetchStatuses = async (pipelineId) => {
    if (statusesMap[pipelineId]) return; // agar oldin olgan bo‘lsa, qayta olmaymiz
    setLoadingStatuses((prev) => ({ ...prev, [pipelineId]: true }));
    try {
      const res = await fetch(
        `/api/get-pipeline-statuses?pipelineId=${pipelineId}`
      );
      const data = await res.json();
      if (res.ok) {
        setStatusesMap((prev) => ({
          ...prev,
          [pipelineId]: data.statuses || [],
        }));
      } else {
        setStatusesMap((prev) => ({ ...prev, [pipelineId]: [] }));
      }
    } catch (err) {
      setStatusesMap((prev) => ({ ...prev, [pipelineId]: [] }));
    } finally {
      setLoadingStatuses((prev) => ({ ...prev, [pipelineId]: false }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">CRM Pipeline va Statuslar</h2>

      {loadingPipelines && <p>Pipeline lar yuklanmoqda...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        {pipelines.map((pipeline) => (
          <div key={pipeline.id} className="border rounded">
            <button
              className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
              onClick={() => fetchStatuses(pipeline.id)}
            >
              <span>
                {pipeline.name} (ID: {pipeline.id})
              </span>
              <span className="text-sm">
                {loadingStatuses[pipeline.id] ? "Yuklanmoqda..." : "+"}
              </span>
            </button>

            {statusesMap[pipeline.id] &&
              statusesMap[pipeline.id].length > 0 && (
                <ul className="p-2 border-t bg-white">
                  {statusesMap[pipeline.id].map((status) => (
                    <li key={status.id} className="py-1">
                      <span className="font-medium">ID:</span> {status.id} |{" "}
                      <span className="font-medium">Name:</span> {status.name}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

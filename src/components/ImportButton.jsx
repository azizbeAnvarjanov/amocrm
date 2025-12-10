"use client";

export default function ImportButton() {
  const handleImport = async () => {
    const res = await fetch("/api/amocrm-import", { method: "POST" });
    const data = await res.json();
    alert("Yuklandi: " + data.count + " ta lead");
  };

  return (
    <button
      onClick={handleImport}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      Imtihonga keladi leadlarni yuklash
    </button>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UpdateButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const updateAll = async () => {
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/update-amo-ball", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        setMsg(`✔ ${data.updated} ta lead yangilandi`);
      } else {
        setMsg("❌ Xatolik: " + data.error);
      }
    } catch (err) {
      setMsg("Server xatosi");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold">AmoCRM ga ballarni yuborish</h1>

      <Button onClick={updateAll} disabled={loading} className="w-full">
        {loading ? "Yuborilmoqda..." : "Barcha leadlarni yangilash"}
      </Button>

      {msg && <div className="p-3 border rounded mt-3">{msg}</div>}
    </div>
  );
}

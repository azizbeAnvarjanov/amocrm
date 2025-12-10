"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CallStats() {
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (!userId || !date) {
      setError("User ID va Sana kerak");
      return;
    }

    setError("");
    setStats(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/calls?date=${date}&user_id=${userId}`);

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Xatolik yuz berdi");
      } else {
        setStats(data.stats);
      }
    } catch (err) {
      setError("Server xatosi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Operator qo‘ng‘iroq statistikasi</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Operator ID</label>
            <Input
              placeholder="Masalan: 123456"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Sana</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleFetch} disabled={loading}>
            {loading ? "Yuklanmoqda..." : "Olish"}
          </Button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Natija</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <p>
              <b>Operator:</b> {stats.name} {stats.surname}
            </p>
            <p>
              <b>Kiruvchi:</b> {stats.incoming}
            </p>
            <p>
              <b>Chiquvchi:</b> {stats.outgoing}
            </p>
            <p>
              <b>Umumiy daqiqa:</b> {stats.total_minutes} min
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

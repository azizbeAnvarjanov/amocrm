import { NextResponse } from "next/server";

const AMO_TOKEN = process.env.AMO_ACCESS_TOKEN;
const AMO_DOMAIN = "uimpulse.amocrm.ru";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date"); // YYYY-MM-DD
    if (!date)
      return NextResponse.json({ error: "Date kiritilmagan" }, { status: 400 });

    // 1️⃣ Operatorlarni olish
    const usersRes = await fetch(`https://${AMO_DOMAIN}/api/v4/users`, {
      headers: {
        Authorization: `Bearer ${AMO_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    const usersData = await usersRes.json();
    const users = usersData._embedded?.users || [];

    // 2️⃣ Call logni olish — ma’lum kun uchun
    // AmoCRM’da calllar / telephony history endpoint ishlatiladi
    const callsRes = await fetch(
      `https://${AMO_DOMAIN}/api/v4/leads/notes?filter[created_at][from]=${date}T00:00:00&filter[created_at][to]=${date}T23:59:59&type=call`,
      {
        headers: { Authorization: `Bearer ${AMO_TOKEN}` },
      }
    );
    const callsData = await callsRes.json();
    const calls = callsData._embedded?.notes || [];
    console.log(JSON.stringify(callsData, null, 2));

    // 3️⃣ Operatorlar bo‘yicha summarizatsiya
    const statsMap = {};

    users.forEach((u) => {
      statsMap[u.id] = {
        user_id: u.id,
        name: u.name,
        surname: u.last_name || "",
        incoming: 0,
        outgoing: 0,
        total_minutes: 0,
      };
    });

    calls.forEach((call) => {
      const userId = call.created_by;
      const durationSec = call.params?.duration || 0; // call duration in seconds
      const minutes = Math.ceil(durationSec / 60);

      if (!statsMap[userId]) return;

      if (call.params?.direction === "incoming") statsMap[userId].incoming += 1;
      if (call.params?.direction === "outgoing") statsMap[userId].outgoing += 1;
      statsMap[userId].total_minutes += minutes;
    });

    const stats = Object.values(statsMap);

    return NextResponse.json({ stats });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

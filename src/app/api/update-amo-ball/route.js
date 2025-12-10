import { NextResponse } from "next/server";

const AMO_TOKEN = process.env.AMO_ACCESS_TOKEN;
const AMO_DOMAIN = "uimpulse.amocrm.ru";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

// 1) Supabasedan barcha leadlarni olish
async function getAllLeads() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/amo_exam_leads?select=amo_id,ball`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  if (!res.ok) {
    console.log(res.text());
    
    throw new Error("Supabase error")};

  return await res.json();
}

// 2) AmoCRM leadni yangilash (ball + status)
async function updateAmoLead(amo_id, ball) {
  const url = `https://${AMO_DOMAIN}/api/v4/leads/${amo_id}`;

  const passedStatus = 82091110; // ball >=50 bo'lsa o'tadigan status

  const body = {
    custom_fields_values: [
      {
        field_id: 908299, // To'plagan ball
        values: [{ value: Number(ball) }],
      },
    ],
  };

  if (ball >= 50) {
    body.status_id = passedStatus;
  }

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${AMO_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.log("AMO ERROR:", await res.text());
    throw new Error("AmoCRM update failed");
  }
}

// 3) API handler → hamma leadlarni ishlaydi
export async function POST() {
  try {
    const leads = await getAllLeads(); // supabase dan hammasini oladi

    for (const lead of leads) {
      if (!lead.amo_id || lead.ball == null) continue;

      await updateAmoLead(lead.amo_id, lead.ball);
    }

    return NextResponse.json({
      success: true,
      updated: leads.length,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

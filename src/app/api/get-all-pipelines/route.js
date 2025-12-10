import { NextResponse } from "next/server";

const AMO_TOKEN = process.env.AMO_ACCESS_TOKEN;
const AMO_DOMAIN = "uimpulse.amocrm.ru";

export async function GET() {
  try {
    const res = await fetch(`https://${AMO_DOMAIN}/api/v4/leads/pipelines`, {
      headers: {
        Authorization: `Bearer ${AMO_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    const pipelines =
      data._embedded?.pipelines?.map((p) => ({ id: p.id, name: p.name })) || [];

    return NextResponse.json({ pipelines });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

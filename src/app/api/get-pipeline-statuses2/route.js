import { NextResponse } from "next/server";

const AMO_TOKEN = process.env.AMO_ACCESS_TOKEN;
const AMO_DOMAIN = "uimpulse.amocrm.ru";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pipelineId = searchParams.get("pipelineId");
  if (!pipelineId)
    return NextResponse.json(
      { error: "Pipeline ID kiritilmagan" },
      { status: 400 }
    );

  try {
    const res = await fetch(
      `https://${AMO_DOMAIN}/api/v4/leads/pipelines/${pipelineId}/statuses`,
      {
        headers: {
          Authorization: `Bearer ${AMO_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    const statuses =
      data._embedded?.statuses?.map((s) => ({ id: s.id, name: s.name })) || [];

    return NextResponse.json({ statuses });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

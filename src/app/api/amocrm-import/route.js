import { NextResponse } from "next/server";

const AMO_TOKEN = process.env.AMO_ACCESS_TOKEN;
const AMO_DOMAIN = "uimpulse.amocrm.ru";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function getExamLeads() {
  const pipelineId = 10365242;
  const statusId = 81956042;

  const url = `https://${AMO_DOMAIN}/api/v4/leads?with=contacts&filter[pipeline_id]=${pipelineId}&filter[statuses][0][status_id]=${statusId}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AMO_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("AmoCRM API error");

  return (await res.json())._embedded.leads ?? [];
}

async function getContact(contactId) {
  const url = `https://${AMO_DOMAIN}/api/v4/contacts/${contactId}?with=custom_fields`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AMO_TOKEN}`,
    },
  });

  if (!res.ok) return null;

  return await res.json();
}

async function insertToSupabase(list) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/amo_exam_leads`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(list),
  });

  if (!res.ok) {
    console.log(await res.text());
    throw new Error("Supabase insert error");
  }
}

export async function POST() {
  try {
    const leads = await getExamLeads();
    console.log("LEADS:", leads);

    const formatted = [];

    for (const lead of leads) {
      let phone = null;

      const contact = lead._embedded?.contacts?.[0];
      if (contact) {
        const contactData = await getContact(contact.id);

        const phoneField = contactData?.custom_fields_values?.find(
          (f) => f.field_code === "PHONE"
        );

        phone = phoneField?.values?.[0]?.value || null;
      }

      formatted.push({
        amo_id: lead.id,
        name: lead.name,
        phone,
        status: "imtihonga keladi",
      });
    }

    console.log("FINAL DATA:", formatted);

    await insertToSupabase(formatted);

    return NextResponse.json({ success: true, inserted: formatted.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

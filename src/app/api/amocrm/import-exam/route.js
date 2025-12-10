import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE
    );

    // 1. AmoCRM dan imtihonga keladi etapidagi lidlarni olish
    const res = await fetch(
      `https://${process.env.AMOCRM_DOMAIN}/api/v4/leads?pipeline_id=${process.env.EXAM_PIPELINE_ID}&status_id=${process.env.EXAM_STATUS_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AMOCRM_ACCESS_TOKEN}`,
        },
      }
    );

    const data = await res.json();
    const leads = data._embedded?.leads || [];

    if (!leads.length) {
      return Response.json({ success: true, imported: 0 });
    }

    // 2. Supabase ga INSERT uchun mapping
    const mapped = leads.map((l) => ({
      lead_id: l.id,
      name: l.name || "",
      phone:
        l.custom_fields_values?.find((f) => f.field_code === "PHONE")
          ?.values?.[0]?.value || "",
      pipeline_id: process.env.EXAM_PIPELINE_ID,
      status_id: process.env.EXAM_STATUS_ID,
    }));

    const { error } = await supabase.from("leads").insert(mapped);
    if (error) throw error;

    return Response.json({
      success: true,
      imported: leads.length,
    });
  } catch (e) {
    console.log(e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

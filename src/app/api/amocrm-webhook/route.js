import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const data = await req.json();

    console.log("Webhook keldi:", data);

    // lead qo'shilgan bo'lsa
    if (data.leads?.add) {
      for (const lead of data.leads.add) {
        await supabase.from("leads").insert({
          lead_id: lead.id,
          name: lead.name,
          price: lead.price,
          status_id: lead.status_id,
          pipeline_id: lead.pipeline_id,
        });
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}

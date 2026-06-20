// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const now = Date.now();
    const day = 86400000;
    const { data: docs } = await supabase.from("documents").select("id,last_opened_at,created_at,lifecycle_status").limit(5000);

    let fresh = 0, stale = 0, archived = 0;
    for (const d of docs ?? []) {
      const ref = d.last_opened_at ?? d.created_at;
      const age = ref ? (now - new Date(ref).getTime()) / day : 999;
      let next = "fresh";
      if (age > 60) next = "archived_suggested";
      else if (age > 21) next = "stale";

      if (next !== d.lifecycle_status) {
        await supabase.from("documents").update({ lifecycle_status: next }).eq("id", d.id);
        if (next === "archived_suggested") {
          await supabase.from("metric_events").insert({ event_type: "doc_archived_suggested", entity_type: "document", entity_id: d.id });
        }
      }
      if (next === "fresh") fresh++; else if (next === "stale") stale++; else archived++;
    }

    return new Response(JSON.stringify({ ok: true, fresh, stale, archived }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("doc-lifecycle-tick error", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

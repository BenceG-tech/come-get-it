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
    const { document_id } = await req.json();
    if (!document_id) throw new Error("document_id required");

    const { data: doc } = await supabase.from("documents").select("id,title,content,description").eq("id", document_id).maybeSingle();
    if (!doc) throw new Error("doc not found");

    const haystack = `${doc.title}\n${doc.description ?? ""}\n${(doc.content ?? "").slice(0, 8000)}`.toLowerCase();

    const { data: partners } = await supabase.from("partners").select("id,company_name,type").limit(2000);
    const links: any[] = [];

    for (const p of partners ?? []) {
      const name = (p.company_name ?? "").toLowerCase().trim();
      if (name.length < 3) continue;
      if (haystack.includes(name)) {
        const entityType = p.type === "venue" ? "lead" : "partner";
        links.push({
          document_id,
          entity_type: entityType,
          entity_id: p.id,
          confidence: 0.8,
          source: "ai",
        });
      }
    }

    if (links.length) {
      const { error } = await supabase.from("document_entity_links").upsert(links, { onConflict: "document_id,entity_type,entity_id" });
      if (error) throw error;
      await supabase.from("metric_events").insert({ event_type: "doc_entity_linked", entity_type: "document", entity_id: document_id, value: links.length });
    }

    return new Response(JSON.stringify({ ok: true, links_count: links.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("doc-entity-bridge error", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

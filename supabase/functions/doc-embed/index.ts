// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CHUNK_CHARS = 2400; // ~600 tokens
const CHUNK_OVERLAP = 200;

function chunkText(text: string): string[] {
  if (!text) return [];
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= CHUNK_CHARS) return [clean];
  const out: string[] = [];
  let i = 0;
  while (i < clean.length) {
    out.push(clean.slice(i, i + CHUNK_CHARS));
    i += CHUNK_CHARS - CHUNK_OVERLAP;
  }
  return out;
}

async function embed(text: string, key: string): Promise<number[]> {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
    body: JSON.stringify({
      model: "openai/text-embedding-3-small",
      input: text,
    }),
  });
  if (!r.ok) throw new Error(`embed ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return j.data[0].embedding;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const body = await req.json().catch(() => ({}));
    const { document_id, document_ids, force } = body;
    const ids: string[] = document_ids ?? (document_id ? [document_id] : []);
    if (!ids.length) throw new Error("document_id(s) required");

    const { data: docs } = await supabase.from("documents").select("id,title,content,summary").in("id", ids);
    const results: any[] = [];

    for (const d of docs ?? []) {
      // skip if already embedded and not forced
      if (!force) {
        const { count } = await supabase.from("document_chunks").select("*", { count: "exact", head: true }).eq("document_id", d.id);
        if ((count ?? 0) > 0) { results.push({ id: d.id, ok: true, skipped: true }); continue; }
      } else {
        await supabase.from("document_chunks").delete().eq("document_id", d.id);
      }

      const source = [d.title, d.summary ?? "", d.content ?? ""].filter(Boolean).join("\n\n");
      const chunks = chunkText(source);
      if (!chunks.length) { results.push({ id: d.id, ok: true, chunks: 0 }); continue; }

      const rows: any[] = [];
      for (let i = 0; i < chunks.length; i++) {
        try {
          const emb = await embed(chunks[i], LOVABLE_API_KEY);
          rows.push({
            document_id: d.id,
            chunk_index: i,
            text: chunks[i],
            token_count: Math.round(chunks[i].length / 4),
            embedding: emb,
          });
        } catch (e) {
          console.error("embed fail", d.id, i, e);
        }
      }
      if (rows.length) {
        const { error } = await supabase.from("document_chunks").insert(rows);
        if (error) { results.push({ id: d.id, ok: false, error: error.message }); continue; }
      }
      await supabase.from("metric_events").insert({ event_type: "doc_embedded", entity_type: "document", entity_id: d.id, value: rows.length });
      results.push({ id: d.id, ok: true, chunks: rows.length });
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("doc-embed error", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

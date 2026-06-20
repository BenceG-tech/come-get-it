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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    // admin guard
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
        if (!isAdmin) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    const { query, top_k = 5, candidates = 20 } = await req.json();
    if (!query || typeof query !== "string") throw new Error("query required");

    // 1) embed query
    const er = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({ model: "openai/text-embedding-3-small", input: query }),
    });
    if (!er.ok) throw new Error(`embed ${er.status}: ${await er.text()}`);
    const qEmb = (await er.json()).data[0].embedding;

    // 2) pgvector top-N
    const { data: matches, error } = await supabase.rpc("match_document_chunks", {
      query_embedding: qEmb,
      match_count: candidates,
    });
    if (error) throw error;

    // 3) hydrate documents
    const docIds = [...new Set((matches ?? []).map((m: any) => m.document_id))];
    const { data: docs } = await supabase.from("documents").select("id,title,category,folder,ai_hook,ai_tags").in("id", docIds);
    const docMap = Object.fromEntries((docs ?? []).map((d: any) => [d.id, d]));

    // 4) rerank via Gemini Flash (top_k from candidates)
    let topResults = (matches ?? []).slice(0, top_k);
    if ((matches ?? []).length > top_k) {
      const rerInput = (matches ?? []).map((m: any, i: number) => ({
        i,
        title: docMap[m.document_id]?.title ?? "",
        snippet: (m.text ?? "").slice(0, 400),
      }));
      try {
        const rr = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: `Te egy reranker vagy. A bemenet egy kérdés és találat-lista (i, title, snippet). Add vissza JSON-ban a top ${top_k} legrelevánsabb indexet: {"top":[i1,i2,...]}` },
              { role: "user", content: JSON.stringify({ query, candidates: rerInput }) },
            ],
            response_format: { type: "json_object" },
          }),
        });
        if (rr.ok) {
          const parsed = JSON.parse(((await rr.json()).choices?.[0]?.message?.content) ?? "{}");
          if (Array.isArray(parsed.top)) {
            topResults = parsed.top.slice(0, top_k).map((i: number) => matches[i]).filter(Boolean);
          }
        }
      } catch (e) { console.warn("rerank fail", e); }
    }

    const results = topResults.map((m: any) => ({
      document_id: m.document_id,
      chunk_index: m.chunk_index,
      similarity: m.similarity,
      snippet: m.text,
      document: docMap[m.document_id] ?? null,
    }));

    await supabase.from("metric_events").insert({ event_type: "doc_semantic_search", metadata: { query: query.slice(0, 200), results: results.length } });

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("doc-semantic-search error", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

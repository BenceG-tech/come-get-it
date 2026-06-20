// @ts-nocheck
import { driveFetch, corsHeaders, requireAdmin } from "../_shared/drive.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    await requireAdmin(req);
    const { query, limit } = await req.json();
    if (!query || typeof query !== "string") return new Response(JSON.stringify({ error: "query required" }), { status: 400, headers: corsHeaders });

    // Extract a few keywords from the checklist item title to search Drive
    const keywords = query.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w: string) => w.length > 3).slice(0, 5);
    if (keywords.length === 0) keywords.push(query.slice(0, 30));

    // Search each keyword, then merge
    const results = new Map<string, any>();
    for (const kw of keywords) {
      const params = new URLSearchParams();
      params.set("q", `trashed = false and (name contains '${kw.replace(/'/g, "\\'")}' or fullText contains '${kw.replace(/'/g, "\\'")}')`);
      params.set("fields", "files(id, name, mimeType, modifiedTime, webViewLink)");
      params.set("pageSize", "10");
      const res = await driveFetch(`/drive/v3/files?${params}`);
      if (!res.ok) continue;
      const j = await res.json();
      for (const f of j.files ?? []) {
        if (!results.has(f.id)) results.set(f.id, { ...f, matched: [kw] });
        else results.get(f.id).matched.push(kw);
      }
    }

    const sorted = Array.from(results.values())
      .sort((a, b) => b.matched.length - a.matched.length)
      .slice(0, limit ?? 5);

    return new Response(JSON.stringify({ matches: sorted, keywords }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    if (e instanceof Response) return e;
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

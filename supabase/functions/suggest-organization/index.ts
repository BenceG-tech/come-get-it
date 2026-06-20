// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `Te a Come Get It belső admin AI-ja vagy. Magyarul gondolkodsz.
Egy lista doksit / képet / videót kapsz az aktuális mappákkal és AI metaadattal (leírás, címkék, hangulat).
Feladat: javasolj jobb mappa-szervezést. A mappa-nevek minta: "NN — Beszédes név" (pl. "03 — Nyári kampány", "07 — Befektetői anyagok").

Szabályok:
- Csak ott javasolj változást, ahol egyértelműen jobb hely van. Ne mindenkire.
- Ha 3+ doksi egy témához tartozik, javasolhatsz ÚJ mappát.
- A confidence 0..1 közötti szám, csak 0.6 felett javasolj áthelyezést.
- Maximum 30 javaslat egy körben.

VÁLASZ KIZÁRÓLAG JSON:
{
  "suggestions": [
    { "doc_id": string, "current_folder": string|null, "suggested_folder": string, "reason": string, "confidence": number }
  ],
  "new_folders": [
    { "name": string, "rationale": string }
  ]
}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

    const body = await req.json().catch(() => ({}));
    const onlyIds: string[] | undefined = Array.isArray(body?.ids) ? body.ids : undefined;

    let q = supabase.from("documents").select("id, title, folder, category, mime_type, description, ai_description, ai_tags, ai_mood, tldr, key_points");
    if (onlyIds && onlyIds.length) q = q.in("id", onlyIds);
    const { data: docs, error } = await q.limit(300);
    if (error) throw error;

    const compact = (docs ?? []).map((d: any) => ({
      id: d.id,
      title: d.title,
      folder: d.folder,
      mime: d.mime_type,
      desc: d.ai_description || d.description || (Array.isArray(d.key_points) ? d.key_points.slice(0, 3).join("; ") : null) || d.tldr,
      tags: d.ai_tags,
      mood: d.ai_mood,
    }));

    const existingFolders = Array.from(new Set((docs ?? []).map((d: any) => d.folder).filter(Boolean)));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Létező mappák:\n${JSON.stringify(existingFolders)}\n\nDoksik:\n${JSON.stringify(compact)}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (up.status === 429) return new Response(JSON.stringify({ error: "Túl sok kérés, próbáld újra később." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (up.status === 402) return new Response(JSON.stringify({ error: "AI kredit elfogyott." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!up.ok) throw new Error(`AI error ${up.status}: ${(await up.text()).slice(0, 300)}`);

    const j = await up.json();
    const txt = j?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(txt);
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

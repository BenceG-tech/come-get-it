// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `Te a Come Get It marketing AI-ja vagy. Magyarul, tegezve, energikus de tömör hangnemben dolgozol.
Egy képet kapsz. Elemezd vizuálisan és adj kreatív, használható javaslatokat a Come Get It márka kontextusában (vendéglátóhelyek, italmárkák, fogyasztói rewards app, fiatal urban közönség).

VÁLASZ KIZÁRÓLAG JSON, ez a séma:
{
  "description": string,                // 1-2 mondat: mit látsz, magyarul
  "suggested_alt": string,              // SEO-barát alt szöveg, max 120 karakter
  "suggested_caption": string,          // rövid social caption magyarul
  "use_cases": string[],                // 3-6 db konkrét felhasználási ötlet (pl. "Instagram story background", "Landing hero fölé", "Partner deck 3. slide")
  "suggested_copy": {
    "instagram": string,                // Instagram poszt szöveg emoji-val, 1-2 mondat + 3-5 hashtag
    "facebook": string,                 // Facebook poszt 2-3 mondat
    "landing_headline": string          // Landing hero headline javaslat, max 8 szó
  },
  "tags": string[],                     // 4-8 db rövid címke
  "mood": string,                       // 2-4 szavas hangulat (pl. "energikus, esti, neon")
  "dominant_colors": string[]           // 3-5 hex szín (pl. ["#0a0a0a", "#00d4ff"])
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

    const { docId } = await req.json();
    if (!docId) return new Response(JSON.stringify({ error: "docId required" }), { status: 400, headers: corsHeaders });

    const { data: d, error } = await supabase.from("documents").select("*").eq("id", docId).maybeSingle();
    if (error || !d) throw new Error(error?.message ?? "Document not found");
    if (!d.storage_path) throw new Error("Nincs fájl a doksihoz.");

    // Resolve image URL
    let imageUrl = d.storage_path;
    if (!imageUrl.startsWith("http")) {
      const { data: signed } = await supabase.storage.from("admin-docs").createSignedUrl(d.storage_path, 3600);
      if (!signed?.signedUrl) throw new Error("Nem sikerült signed URL-t generálni.");
      imageUrl = signed.signedUrl;
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              { type: "text", text: `Elemezd ezt a képet. Kontextus: cím="${d.title}", mappa="${d.folder ?? ""}"` },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
        stream: true,
      }),
    });

    if (up.status === 429) return new Response(JSON.stringify({ error: "Túl sok kérés, próbáld újra később." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (up.status === 402) return new Response(JSON.stringify({ error: "AI kredit elfogyott." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!up.ok || !up.body) throw new Error(`AI error ${up.status}: ${(await up.text()).slice(0, 300)}`);

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let full = "";
    const stream = new ReadableStream({
      async start(controller) {
        const reader = up.body!.getReader();
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const l = line.trim();
              if (!l.startsWith("data:")) continue;
              const data = l.slice(5).trim();
              if (data === "[DONE]") continue;
              try {
                const j = JSON.parse(data);
                const delta = j?.choices?.[0]?.delta?.content ?? "";
                if (delta) {
                  full += delta;
                  controller.enqueue(encoder.encode(delta));
                }
              } catch { /* ignore */ }
            }
          }
          try {
            const p = JSON.parse(full);
            const update = {
              ai_description: typeof p.description === "string" ? p.description.slice(0, 1000) : null,
              ai_suggested_alt: typeof p.suggested_alt === "string" ? p.suggested_alt.slice(0, 300) : null,
              ai_suggested_caption: typeof p.suggested_caption === "string" ? p.suggested_caption.slice(0, 500) : null,
              ai_use_cases: Array.isArray(p.use_cases) ? p.use_cases.slice(0, 10) : null,
              ai_suggested_copy: p.suggested_copy && typeof p.suggested_copy === "object" ? p.suggested_copy : null,
              ai_tags: Array.isArray(p.tags) ? p.tags.slice(0, 12).map(String) : null,
              ai_mood: typeof p.mood === "string" ? p.mood.slice(0, 100) : null,
              ai_dominant_colors: Array.isArray(p.dominant_colors) ? p.dominant_colors.slice(0, 6).map(String) : null,
              ai_analyzed_at: new Date().toISOString(),
            };
            await supabase.from("documents").update(update).eq("id", docId);

            // Versioning: keep last 5
            await supabase.from("image_analysis_versions").update({ is_current: false }).eq("document_id", docId);
            await supabase.from("image_analysis_versions").insert({
              document_id: docId,
              result: update,
              is_current: true,
              created_by: user.id,
            });
            const { data: oldV } = await supabase
              .from("image_analysis_versions")
              .select("id")
              .eq("document_id", docId)
              .order("created_at", { ascending: false })
              .range(5, 100);
            if (oldV && oldV.length > 0) {
              await supabase.from("image_analysis_versions").delete().in("id", oldV.map((v: any) => v.id));
            }
          } catch (e) {
            console.error("Parse/persist failed", e);
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8", "X-Accel-Buffering": "no" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

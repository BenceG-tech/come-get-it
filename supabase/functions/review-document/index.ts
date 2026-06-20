// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `Te a Come Get It belső doksi-reviewer AI-ja vagy. Magyarul, közvetlen, üzletfókuszú hangon dolgozol.
Egy doksi metaadatát + tartalmát kapod. Vizsgáld meg NÉGY szempontból, mindegyikre adj 1-10 pontot és KONKRÉT észrevételeket (idézz a doksiból ha kell):

1. content_accuracy — Tartalmi pontosság: ellentmondások, hiányzó adatok, elavult állítások, ténybeli hibák
2. brand_tone — Brand & hangnem: Come Get It magyar tegező, energikus, lelkes, "Csatlakozom"/"Regisztrálok" stílus
3. legal_risk — Jogi/üzleti kockázat: ÁSZF, partner-megállapodás, GDPR, kötelezettségvállalások, kockázatos megfogalmazás
4. marketing_power — Marketing erő: hook, CTA, érzelmi hatás, hol gyenge, hol erősebb lehetne

Mindegyik szempontnál:
- score: 1-10 (őszintén, ne adj alapból 8+)
- summary: 1 mondat
- issues: 2-5 db konkrét észrevétel (mindegyik tartalmaz: location (hol), problem (mi a baj), fix (javaslat))

Plusz:
- overall: 1-2 mondatos összefoglaló
- top_actions: 3-5 legfontosabb teendő prioritás szerint (rövid mondatok)

VÁLASZ KIZÁRÓLAG JSON:
{"overall": string, "top_actions": string[], "content_accuracy": {"score": number, "summary": string, "issues": [{"location": string, "problem": string, "fix": string}]}, "brand_tone": {...ugyanígy...}, "legal_risk": {...}, "marketing_power": {...}}`;

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

    const payload = {
      title: d.title,
      category: d.category,
      folder: d.folder,
      description: d.description,
      when_to_use: d.when_to_use,
      tldr: d.tldr,
      content: d.content ? String(d.content).slice(0, 14000) : null,
    };

    if (!payload.content && !payload.description) {
      return new Response(JSON.stringify({ error: "Nincs szöveges tartalom amit reviewolni lehetne." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY! },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Doksi:\n${JSON.stringify(payload)}` },
        ],
      }),
    });

    if (up.status === 429) return new Response(JSON.stringify({ error: "Túl sok kérés." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (up.status === 402) return new Response(JSON.stringify({ error: "AI kredit elfogyott." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!up.ok || !up.body) throw new Error(`AI error ${up.status}`);

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
                if (delta) { full += delta; controller.enqueue(encoder.encode(delta)); }
              } catch { /* ignore */ }
            }
          }
          try {
            const parsed = JSON.parse(full);
            await supabase.from("documents").update({
              ai_review: parsed,
              last_reviewed_at: new Date().toISOString(),
            }).eq("id", docId);
          } catch (e) {
            console.error("Review parse failed", e);
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, { headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8", "X-Accel-Buffering": "no" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

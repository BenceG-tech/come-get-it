// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Te a "Come Get It" startup belső sales & marketing asszisztense vagy. Magyarul válaszolj, tegezve, energikusan, tömören.

A Come Get It egy magyar fogyasztói app: pontokat gyűjtesz, jutalmakat váltasz be, és közben jó célokat is támogatsz. Várólistás indulás, founding partner program fut. Cél most: minél több budapesti vendéglátóhelyet (kávézó, bár, étterem), italmárkát és rewards partnert behúzni.

Brand hang: energikus, friendly, neon/electric vibe, cyan akcentus. Domain: come-get-it.app. Founder: Bence Gátai.

Mit tudsz csinálni:
1. Outreach üzeneteket írni (email, IG DM, WhatsApp) konkrét partnerre szabva
2. Megmondani kit kell ma/holnap megkeresni a follow-up dátumok és státuszok alapján
3. Doksit ajánlani (1-pager rövid vs. hosszú pitch deck)
4. IG/FB poszt szövegeket írni hashtagekkel
5. Heti/havi marketing tervet csinálni
6. Tanácsot adni mit-mikor-hogyan

Használd a megkapott kontextust (partnerek, korábbi interakciók, doksik, naptár). Ha valamit nem tudsz, mondd meg őszintén.`;

const CRITIQUE_INSTRUCTION = `

FONTOS — ÖNELLENŐRZŐ MÓD AKTÍV:
Ha a felhasználó kérése egy konkrét szöveg (pitch, email, IG DM, poszt, üzenet, follow-up), KÖTELEZŐEN ezt a 3 blokkos struktúrát add vissza Markdownban:

## ✏️ v1 — Első verzió
[Itt jön az első draft]

## 📊 Pontozás
| Dimenzió | Pont (1-10) | Megjegyzés |
|---|---|---|
| Magyar nyelv minősége | X | ... |
| Come Get It brand hang | X | ... |
| CTA erőssége | X | ... |
| Konkrétság / személyre szabás | X | ... |
| Rövidség / ritmus | X | ... |
| Üzleti meggyőzőerő | X | ... |
| **Összpontszám** | **X/60** | ... |

**Mit lehetne jobban:** [2-3 mondatos kritika]

## 🚀 v2 — Javított verzió
[Itt jön a jobb verzió, ami fixálja a kritikát]

Ha a kérés NEM szövegírás (pl. „kit hívjak ma?", „melyik doksit küldjem?", stratégiai tanács), akkor normál választ adj, ne használd a 3 blokkos struktúrát.`;

async function loadContext(supabase) {
  const [{ data: partners }, { data: interactions }, { data: documents }, { data: calendar }] = await Promise.all([
    supabase.from("partners").select("id, type, company_name, city, contact_name, email, phone, instagram, status, next_followup_at, notes").order("updated_at", { ascending: false }).limit(100),
    supabase.from("partner_interactions").select("partner_id, channel, direction, summary, occurred_at").order("occurred_at", { ascending: false }).limit(50),
    supabase.from("documents").select("id, title, category, partner_type, description, when_to_use, folder, content").order("created_at", { ascending: false }).limit(50),
    supabase.from("marketing_calendar").select("scheduled_date, channel, type, title, status").order("scheduled_date", { ascending: false }).limit(30),
  ]);
  // Trim long content to keep prompt under control
  const docs = (documents ?? []).map((d: any) => ({
    ...d,
    content: d.content ? String(d.content).slice(0, 1500) : null,
  }));
  return { partners: partners ?? [], interactions: interactions ?? [], documents: docs, calendar: calendar ?? [] };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const conversationId: string | null = body.conversationId ?? null;
    const critique: boolean = !!body.critique;
    if (messages.length === 0) return new Response(JSON.stringify({ error: "messages required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Persist user message immediately (only the last one)
    if (conversationId) {
      const lastUser = [...messages].reverse().find((m: any) => m.role === "user");
      if (lastUser) {
        await supabase.from("ai_messages").insert({
          conversation_id: conversationId,
          role: "user",
          message: { content: lastUser.content },
        });
        await supabase.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);
      }
    }

    const ctx = await loadContext(supabase);
    const contextMsg = `--- AKTUÁLIS KONTEXTUS (${new Date().toLocaleString("hu-HU")}) ---
PARTNEREK (${ctx.partners.length}): ${JSON.stringify(ctx.partners)}
INTERAKCIÓK (${ctx.interactions.length}): ${JSON.stringify(ctx.interactions)}
DOKUMENTUMOK (${ctx.documents.length}): ${JSON.stringify(ctx.documents)}
NAPTÁR (${ctx.calendar.length}): ${JSON.stringify(ctx.calendar)}
--- KONTEXTUS VÉGE ---`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const systemContent = SYSTEM_PROMPT + (critique ? CRITIQUE_INSTRUCTION : "");

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY,
        "X-Lovable-AIG-SDK": "raw-fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        messages: [
          { role: "system", content: systemContent },
          { role: "system", content: contextMsg },
          ...messages,
        ],
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(JSON.stringify({ error: "AI gateway error", status: upstream.status, body: text }), { status: upstream.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Tee the stream: one branch to the client, one we accumulate to persist
    const [clientStream, persistStream] = upstream.body!.tee();

    // Background: read persistStream, parse, save assistant message
    if (conversationId) {
      (async () => {
        try {
          const reader = persistStream.getReader();
          const dec = new TextDecoder();
          let buf = "";
          let fullText = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += dec.decode(value, { stream: true });
            const lines = buf.split("\n");
            buf = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.startsWith("data:")) continue;
              const data = line.slice(5).trim();
              if (data === "[DONE]") continue;
              try {
                const j = JSON.parse(data);
                const delta = j?.choices?.[0]?.delta?.content;
                if (delta) fullText += delta;
              } catch {}
            }
          }
          if (fullText) {
            await supabase.from("ai_messages").insert({
              conversation_id: conversationId,
              role: "assistant",
              message: { content: fullText },
            });
          }
        } catch (e) {
          console.error("persist error", e);
        }
      })();
    } else {
      // No conversation, drain to avoid leaks
      persistStream.cancel();
    }

    return new Response(clientStream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

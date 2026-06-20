// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FORMATS: Record<string, string> = {
  email_partner: "Hivatalos, magyar nyelvű partneri email (tárgy + body). Hangnem: lelkes, profi, tegező. Max 220 szó. Tartalmazza CTA-t.",
  email_followup: "Rövid follow-up email magyarul partnernek (tárgy + body), tegező, 80-120 szó, egy konkrét CTA.",
  instagram_post: "Magyar Instagram poszt caption: 1-2 mondatos hook, 3-5 bullet, 5-8 hashtag (#comegetit, #vendéglátás stb.), 1 CTA. Emoji-k engedettek.",
  facebook_post: "Magyar Facebook poszt: 1 erős nyitómondat, 80-150 szó, 1 CTA. Emoji-k mértékkel.",
  linkedin_post: "Magyar LinkedIn poszt: szakmai hangnem, 150-220 szó, story-driven, 3-5 hashtag (#startup, #f&b).",
  tweet_thread: "Magyar X/Twitter thread: 4-6 tweet, mindegyik <280 karakter, számozva (1/, 2/, ...). Hook az elsőben.",
  press_release: "Magyar sajtóközlemény: cím, alcím, lead bekezdés, 2-3 testbekezdés, idézet Bence Gátaitól, boilerplate.",
  one_liner: "5 db rövid (max 100 karakteres) one-liner / hook magyarul, számozva.",
};

const SYSTEM = `Te a Come Get It marketing copywriter AI-ja vagy. Magyarul, brandhangon (lelkes, tegező, energikus, üzletfókuszú) írsz.
Brand fact-ok: come-get-it.app domain, Bence Gátai alapító, vendéglátóhelyek + italmárkák + rewards partnerek, waitlist-only most.
Egy belső doksi tartalmát kapod + egy célformátumot. Készíts közvetlenül használható szöveget.
NE adj meta magyarázatot, NE írd hogy "Itt a szöveg:". Csak a tiszta végeredmény.`;

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

    const { docId, format, extraInstructions } = await req.json();
    if (!docId || !format) return new Response(JSON.stringify({ error: "docId és format kötelező" }), { status: 400, headers: corsHeaders });
    const formatPrompt = FORMATS[format];
    if (!formatPrompt) return new Response(JSON.stringify({ error: "Ismeretlen formátum" }), { status: 400, headers: corsHeaders });

    const { data: d, error } = await supabase.from("documents").select("title,category,folder,description,when_to_use,content,tldr,key_points").eq("id", docId).maybeSingle();
    if (error || !d) throw new Error(error?.message ?? "Document not found");

    const docContext = {
      title: d.title,
      category: d.category,
      description: d.description,
      tldr: d.tldr,
      key_points: d.key_points,
      content: d.content ? String(d.content).slice(0, 10000) : null,
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY! },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `FORMÁTUM: ${formatPrompt}\n\n${extraInstructions ? `EXTRA UTASÍTÁS: ${extraInstructions}\n\n` : ""}DOKSI FORRÁS:\n${JSON.stringify(docContext)}` },
        ],
      }),
    });

    if (up.status === 429) return new Response(JSON.stringify({ error: "Túl sok kérés, próbáld újra később." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (up.status === 402) return new Response(JSON.stringify({ error: "AI kredit elfogyott." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!up.ok || !up.body) throw new Error(`AI error ${up.status}`);

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
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
                if (delta) controller.enqueue(encoder.encode(delta));
              } catch { /* ignore */ }
            }
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

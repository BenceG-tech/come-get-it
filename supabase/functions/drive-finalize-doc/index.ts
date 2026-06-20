// @ts-nocheck
import { driveFetch, driveGetContent, corsHeaders, requireAdmin } from "../_shared/drive.ts";

const SYSTEM = `Te a Come Get It belső doksi-konszolidátor AI-ja vagy. Magyarul, profi üzleti hangon írsz.
Több forrás-doksi tartalmát + a felhasználó által eldöntött kérdéseket-válaszokat kapod. Készítsd el a KONSZOLIDÁLT, VÉGLEGES verziót a megadott témában.

Szabályok:
- Ne tartsd meg a forrás-doksik ellentmondásait — válaszd ki a legjobbat / legfrissebbet, és ha van eldöntött válasz a kérdés-naplóban, azt használd
- A doksi legyen önmagában teljes (ne hivatkozz "ld. korábbi verzió")
- Markdown formátum, tiszta címek, listák
- Magyar, tegező vagy hivatalos hangnem a téma függvényében (ÁSZF → hivatalos, marketing → tegező)
- Ne találj ki tényt; ha valami hiányzik, jelöld [[KITÖLTENDŐ: mi]]

Csak a végleges markdown szöveget add vissza, semmilyen meta magyarázat nélkül.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { supabase } = await requireAdmin(req);
    const { fileIds, topic, includeDecisions } = await req.json();
    if (!Array.isArray(fileIds) || fileIds.length === 0 || !topic) {
      return new Response(JSON.stringify({ error: "fileIds + topic required" }), { status: 400, headers: corsHeaders });
    }

    const fetched = await Promise.all(fileIds.map(async (id: string) => {
      try {
        const metaRes = await driveFetch(`/drive/v3/files/${id}?fields=id,name,mimeType,modifiedTime`);
        if (!metaRes.ok) return null;
        const meta = await metaRes.json();
        const content = await driveGetContent(id, meta.mimeType);
        return { name: meta.name, modifiedTime: meta.modifiedTime, content: content.slice(0, 15000) };
      } catch { return null; }
    }));

    let decisions: any[] = [];
    if (includeDecisions) {
      const { data } = await supabase.from("drive_decisions").select("question,answer,topic").eq("status", "answered").limit(50);
      decisions = data ?? [];
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY! },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `TÉMA: ${topic}\n\nELDÖNTÖTT KÉRDÉSEK:\n${JSON.stringify(decisions)}\n\nFORRÁSOK:\n${JSON.stringify(fetched.filter(Boolean))}` },
        ],
      }),
    });

    if (up.status === 429) return new Response(JSON.stringify({ error: "Túl sok kérés." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (up.status === 402) return new Response(JSON.stringify({ error: "AI kredit elfogyott." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!up.ok || !up.body) throw new Error(`AI ${up.status}`);

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
    if (e instanceof Response) return e;
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

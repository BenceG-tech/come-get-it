// @ts-nocheck
import { driveFetch, driveGetContent, corsHeaders, requireAdmin } from "../_shared/drive.ts";
import { assertInScope } from "../_shared/drive-scope.ts";

const SYSTEM = `Te a Come Get It belső "Drive-átvilágító" AI-ja vagy. Magyarul, direkt, lényegre törő.
Több Google Drive doksi tartalmát kapod. A célod:
1. CONTRADICTIONS — Találj konkrét ellentmondásokat hasonló doksik között (pl. két ÁSZF verzió eltérő pontjai, partner-megállapodások másféle számai). Minden ellentmondásnál: érintett fájlok, mi az eltérés idézettel, mi a javaslatod a véglegesre.
2. OUTDATED — Jelöld az elavultnak tűnő tartalmat (régi dátum, "v1" névben, már nem érvényes adatok).
3. QUESTIONS — 5-10 db KONKRÉT kérdés a tulajdonosnak (Bence) amire válasz kell ahhoz hogy konszolidálni lehessen. Pl. "Melyik a végleges revenue share: 20% vagy 25%? (Forrás: ASZF_v2.docx vs Partner_meeting_notes.md)"
4. THEMES — Csoportosítsd a doksikat 3-6 témába (pl. "ÁSZF", "Partner megállapodás", "Pitch deck"). Mindegyiknél fileok + 1 mondatos összefoglaló.

VÁLASZ KIZÁRÓLAG JSON:
{"themes":[{"name":string,"file_ids":string[],"summary":string}],"contradictions":[{"topic":string,"file_ids":string[],"detail":string,"recommendation":string}],"outdated":[{"file_id":string,"reason":string}],"questions":[{"topic":string,"question":string,"file_ids":string[]}]}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { supabase, user } = await requireAdmin(req);
    const { fileIds } = await req.json();
    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return new Response(JSON.stringify({ error: "fileIds (array) szükséges" }), { status: 400, headers: corsHeaders });
    }
    if (fileIds.length > 12) {
      return new Response(JSON.stringify({ error: "Max 12 fájl egyszerre." }), { status: 400, headers: corsHeaders });
    }

    // Fetch all files in parallel
    const fetched = await Promise.all(fileIds.map(async (id: string) => {
      try {
        const metaRes = await driveFetch(`/drive/v3/files/${id}?fields=id,name,mimeType,modifiedTime`);
        if (!metaRes.ok) return { id, error: `meta ${metaRes.status}` };
        const meta = await metaRes.json();
        const content = await driveGetContent(id, meta.mimeType);
        return { id, name: meta.name, mimeType: meta.mimeType, modifiedTime: meta.modifiedTime, content: content.slice(0, 12000) };
      } catch (e: any) {
        return { id, error: e?.message };
      }
    }));

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
          { role: "user", content: `Fájlok:\n${JSON.stringify(fetched)}` },
        ],
      }),
    });

    if (up.status === 429) return new Response(JSON.stringify({ error: "Túl sok kérés." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (up.status === 402) return new Response(JSON.stringify({ error: "AI kredit elfogyott." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!up.ok || !up.body) throw new Error(`AI ${up.status}`);

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
          // Persist analysis + open questions
          try {
            const parsed = JSON.parse(full);
            const names = fetched.filter((f: any) => f.name).map((f: any) => ({ id: f.id, name: f.name }));
            const { data: inserted } = await supabase.from("drive_analyses").insert({
              kind: "batch",
              source_file_ids: fileIds,
              source_file_names: names,
              result: parsed,
              created_by: user.id,
            }).select().single();

            // Auto-open decisions from questions
            if (Array.isArray(parsed.questions)) {
              const rows = parsed.questions.slice(0, 20).map((q: any) => ({
                topic: q.topic ?? null,
                question: q.question,
                source_file_ids: q.file_ids ?? [],
                status: "open",
              }));
              if (rows.length) await supabase.from("drive_decisions").insert(rows);
            }
          } catch (e) {
            console.error("Analyze persist failed", e);
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

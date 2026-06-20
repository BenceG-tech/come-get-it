// @ts-nocheck
import { driveFetch, corsHeaders, requireAdmin } from "../_shared/drive.ts";
import { getRootFolder, getArchiveFolder } from "../_shared/drive-scope.ts";

const SYSTEM = `Te a Come Get It belső Drive-rendszerező AI-ja vagy. Magyarul, lényegre törő.
Fájlok listáját kapod (név, mime, modifiedTime, parent). Feladatod minden fájlhoz:
- theme: max 1-2 szó, témakör. Csoportosíts; használd ezeket ha illik: "Pitch deck", "Befektető", "ÁSZF/Jog", "Partner szerződés", "Marketing", "Branding", "Termékterv", "Pénzügy", "Operatív", "Meeting jegyzet", "Egyéb"
- age_signal: "current" | "stale" | "obsolete"
  - obsolete: név tartalmaz "v1", "régi", "old", "draft" és van újabb v2/v3, VAGY 12+ hónapja nem módosult
  - stale: 6-12 hónapja nem módosult, vagy másolat-jellegű név ("másolat", "copy")
  - current: minden más
- suggested_action: "keep" | "archive" | "review"
  - archive: obsolete VAGY duplikátum nem-keeper példánya
  - review: bizonytalan eset (kétértelmű név, nincs elég info)
  - keep: minden más
- duplicate_group: ha 2+ fájl szinte ugyanaz (név + téma alapján), adj nekik közös csoport-id-t (pl. "asz_2024"). A legfrissebb a keeper (action=keep), a többi action=archive
- reason: 1 mondat magyarul, miért

VÁLASZ KIZÁRÓLAG JSON: {"items":[{"file_id":string,"theme":string,"age_signal":string,"suggested_action":string,"duplicate_group":string|null,"reason":string}]}`;

async function listAllRecursive(rootId: string, archiveId: string | null, maxFiles = 500): Promise<any[]> {
  const out: any[] = [];
  const queue: string[] = [rootId];
  const visited = new Set<string>();
  while (queue.length && out.length < maxFiles) {
    const folder = queue.shift()!;
    if (visited.has(folder)) continue;
    visited.add(folder);
    if (folder === archiveId) continue; // skip archive subtree
    let pageToken: string | undefined;
    do {
      const params = new URLSearchParams();
      params.set("q", `'${folder}' in parents and trashed = false`);
      params.set("fields", "nextPageToken, files(id,name,mimeType,modifiedTime,parents)");
      params.set("pageSize", "200");
      if (pageToken) params.set("pageToken", pageToken);
      params.set("includeItemsFromAllDrives", "true");
      params.set("supportsAllDrives", "true");
      const res = await driveFetch(`/drive/v3/files?${params}`);
      if (!res.ok) break;
      const j = await res.json();
      for (const f of j.files ?? []) {
        if (f.mimeType === "application/vnd.google-apps.folder") {
          queue.push(f.id);
        } else {
          out.push(f);
          if (out.length >= maxFiles) break;
        }
      }
      pageToken = j.nextPageToken;
    } while (pageToken && out.length < maxFiles);
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { supabase } = await requireAdmin(req);
    const root = await getRootFolder(supabase);
    if (!root) return new Response(JSON.stringify({ error: "Először állítsd be a Drive forrás-mappát." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const archive = await getArchiveFolder(supabase);

    const files = await listAllRecursive(root.id, archive?.id ?? null, 500);
    if (files.length === 0) {
      return new Response(JSON.stringify({ scanned: 0, message: "Nincs fájl a mappában." }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Compact payload for AI
    const compact = files.map((f) => ({
      id: f.id,
      name: f.name,
      mime: f.mimeType,
      modified: f.modifiedTime,
    }));

    // Chunk if too many
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const CHUNK = 80;
    const allItems: any[] = [];
    for (let i = 0; i < compact.length; i += CHUNK) {
      const slice = compact.slice(i, i + CHUNK);
      const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY! },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: `Fájlok:\n${JSON.stringify(slice)}` },
          ],
        }),
      });
      if (up.status === 429) return new Response(JSON.stringify({ error: "Túl sok kérés." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (up.status === 402) return new Response(JSON.stringify({ error: "AI kredit elfogyott." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (!up.ok) throw new Error(`AI ${up.status}: ${(await up.text()).slice(0, 200)}`);
      const j = await up.json();
      try {
        const parsed = JSON.parse(j?.choices?.[0]?.message?.content ?? "{}");
        if (Array.isArray(parsed.items)) allItems.push(...parsed.items);
      } catch { /* skip chunk */ }
    }

    // Upsert into drive_inventory
    const byId: Record<string, any> = {};
    for (const it of allItems) byId[it.file_id] = it;

    const rows = files.map((f) => {
      const it = byId[f.id] ?? {};
      return {
        file_id: f.id,
        name: f.name,
        mime_type: f.mimeType,
        modified_time: f.modifiedTime ?? null,
        parent_id: f.parents?.[0] ?? null,
        theme: it.theme ?? "Egyéb",
        age_signal: it.age_signal ?? "current",
        suggested_action: it.suggested_action ?? "keep",
        duplicate_group: it.duplicate_group ?? null,
        ai_reason: it.reason ?? null,
        scanned_at: new Date().toISOString(),
      };
    });

    // Upsert chunked
    for (let i = 0; i < rows.length; i += 100) {
      await supabase.from("drive_inventory").upsert(rows.slice(i, i + 100), { onConflict: "file_id" });
    }

    return new Response(JSON.stringify({ scanned: rows.length, scope: root }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    if (e instanceof Response) return e;
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

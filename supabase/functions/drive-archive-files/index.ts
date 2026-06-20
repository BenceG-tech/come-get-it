// @ts-nocheck
import { driveFetch, corsHeaders, requireAdmin } from "../_shared/drive.ts";
import { assertInScope, ensureArchiveFolder, ensureSubfolder } from "../_shared/drive-scope.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { supabase } = await requireAdmin(req);
    const { fileIds, restore } = await req.json();
    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return new Response(JSON.stringify({ error: "fileIds szükséges" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    await assertInScope(supabase, fileIds);

    const archive = await ensureArchiveFolder(supabase);
    const results: any[] = [];

    for (const fileId of fileIds) {
      try {
        // Load inventory row
        const { data: inv } = await supabase.from("drive_inventory").select("*").eq("file_id", fileId).maybeSingle();

        if (restore) {
          // Move back to first previous parent
          const previous = inv?.previous_parents?.[0];
          if (!previous) { results.push({ fileId, ok: false, error: "Nincs eredeti szülő rögzítve." }); continue; }
          const metaRes = await driveFetch(`/drive/v3/files/${fileId}?fields=parents&supportsAllDrives=true`);
          const meta = metaRes.ok ? await metaRes.json() : { parents: [] };
          const currentParents = (meta.parents ?? []).join(",");
          const patch = await driveFetch(`/drive/v3/files/${fileId}?addParents=${previous}&removeParents=${currentParents}&supportsAllDrives=true`, { method: "PATCH", body: JSON.stringify({}) });
          if (!patch.ok) throw new Error(`Drive ${patch.status}: ${(await patch.text()).slice(0, 200)}`);
          await supabase.from("drive_inventory").update({ archived: false, archived_at: null, parent_id: previous }).eq("file_id", fileId);
          results.push({ fileId, ok: true, movedTo: previous });
        } else {
          // Determine archive subfolder: _Archív/<year>/<theme>
          const year = (inv?.modified_time ? new Date(inv.modified_time) : new Date()).getFullYear().toString();
          const theme = (inv?.theme ?? "Egyéb").replace(/[\/\\]/g, "-");
          const yearFolder = await ensureSubfolder(archive.id, year);
          const themeFolder = await ensureSubfolder(yearFolder, theme);

          const metaRes = await driveFetch(`/drive/v3/files/${fileId}?fields=parents&supportsAllDrives=true`);
          const meta = metaRes.ok ? await metaRes.json() : { parents: [] };
          const currentParents: string[] = meta.parents ?? [];
          const removeParents = currentParents.join(",");

          const patch = await driveFetch(`/drive/v3/files/${fileId}?addParents=${themeFolder}&removeParents=${removeParents}&supportsAllDrives=true`, { method: "PATCH", body: JSON.stringify({}) });
          if (!patch.ok) throw new Error(`Drive ${patch.status}: ${(await patch.text()).slice(0, 200)}`);

          await supabase.from("drive_inventory").upsert({
            file_id: fileId,
            name: inv?.name ?? "?",
            mime_type: inv?.mime_type ?? null,
            modified_time: inv?.modified_time ?? null,
            previous_parents: currentParents,
            parent_id: themeFolder,
            theme: inv?.theme ?? "Egyéb",
            age_signal: inv?.age_signal ?? "obsolete",
            suggested_action: "archive",
            archived: true,
            archived_at: new Date().toISOString(),
          }, { onConflict: "file_id" });

          results.push({ fileId, ok: true, movedTo: themeFolder });
        }
      } catch (e: any) {
        results.push({ fileId, ok: false, error: e?.message ?? String(e) });
      }
    }

    return new Response(JSON.stringify({ results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    if (e instanceof Response) return e;
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

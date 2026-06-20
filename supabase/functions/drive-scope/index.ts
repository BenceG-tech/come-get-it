// @ts-nocheck
// Sets/clears the Drive root folder for scope. Also auto-creates the _Archív subfolder.
import { driveFetch, corsHeaders, requireAdmin } from "../_shared/drive.ts";
import { ensureArchiveFolder } from "../_shared/drive-scope.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { supabase } = await requireAdmin(req);
    const { action, folderId, q } = await req.json().catch(() => ({}));

    // Search for folders by name
    if (action === "search") {
      const params = new URLSearchParams();
      params.set("q", `mimeType = 'application/vnd.google-apps.folder' and trashed = false${q ? ` and name contains '${String(q).replace(/'/g, "\\'")}'` : ""}`);
      params.set("fields", "files(id,name,modifiedTime,parents)");
      params.set("pageSize", "30");
      params.set("orderBy", "modifiedTime desc");
      params.set("includeItemsFromAllDrives", "true");
      params.set("supportsAllDrives", "true");
      const res = await driveFetch(`/drive/v3/files?${params}`);
      const body = await res.text();
      return new Response(body, { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get current scope
    if (action === "get") {
      const { data: root } = await supabase.from("brand_knowledge").select("value").eq("key", "drive_root_folder").maybeSingle();
      const { data: arch } = await supabase.from("brand_knowledge").select("value").eq("key", "drive_archive_folder").maybeSingle();
      return new Response(JSON.stringify({ root: root?.value ?? null, archive: arch?.value ?? null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Set scope
    if (action === "set") {
      if (!folderId) return new Response(JSON.stringify({ error: "folderId szükséges" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const metaRes = await driveFetch(`/drive/v3/files/${folderId}?fields=id,name,mimeType&supportsAllDrives=true`);
      if (!metaRes.ok) return new Response(JSON.stringify({ error: "A mappa nem található." }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const meta = await metaRes.json();
      if (meta.mimeType !== "application/vnd.google-apps.folder") {
        return new Response(JSON.stringify({ error: "Az ID nem mappára mutat." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      await supabase.from("brand_knowledge").upsert({ key: "drive_root_folder", value: { id: meta.id, name: meta.name } }, { onConflict: "key" });
      // Clear old archive ref so it gets recreated inside new scope
      await supabase.from("brand_knowledge").delete().eq("key", "drive_archive_folder");
      const archive = await ensureArchiveFolder(supabase);
      return new Response(JSON.stringify({ root: { id: meta.id, name: meta.name }, archive }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Clear scope
    if (action === "clear") {
      await supabase.from("brand_knowledge").delete().in("key", ["drive_root_folder", "drive_archive_folder"]);
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "ismeretlen action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    if (e instanceof Response) return e;
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

// @ts-nocheck
import { driveFetch, corsHeaders, requireAdmin } from "../_shared/drive.ts";
import { getRootFolder, getArchiveFolder } from "../_shared/drive-scope.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { supabase } = await requireAdmin(req);
    const { q, folderId, pageToken, pageSize, includeArchive } = await req.json().catch(() => ({}));

    const root = await getRootFolder(supabase);
    const archive = await getArchiveFolder(supabase);

    const params = new URLSearchParams();
    const queryParts: string[] = ["trashed = false"];

    // Decide which folder we're browsing
    const targetFolder = folderId ?? (root ? root.id : null);
    if (targetFolder) queryParts.push(`'${targetFolder}' in parents`);
    else if (root) queryParts.push(`'${root.id}' in parents`);

    if (q) queryParts.push(`name contains '${String(q).replace(/'/g, "\\'")}'`);

    // Hide archive folder from default root listing unless explicitly requested
    if (root && (folderId === null || folderId === undefined || folderId === root.id) && archive && !includeArchive) {
      queryParts.push(`'${archive.id}' != id`);
    }

    params.set("q", queryParts.join(" and "));
    params.set("fields", "nextPageToken, files(id, name, mimeType, size, modifiedTime, iconLink, webViewLink, parents)");
    params.set("orderBy", "modifiedTime desc");
    params.set("pageSize", String(pageSize ?? 100));
    if (pageToken) params.set("pageToken", pageToken);
    params.set("includeItemsFromAllDrives", "true");
    params.set("supportsAllDrives", "true");

    const res = await driveFetch(`/drive/v3/files?${params}`);
    const body = await res.text();
    const parsed = JSON.parse(body);
    return new Response(JSON.stringify({ ...parsed, scope: root, archive }), {
      status: res.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    if (e instanceof Response) return e;
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

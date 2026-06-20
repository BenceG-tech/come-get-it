// @ts-nocheck
import { driveFetch, corsHeaders, requireAdmin } from "../_shared/drive.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    await requireAdmin(req);
    const { q, folderId, pageToken, pageSize } = await req.json().catch(() => ({}));

    const params = new URLSearchParams();
    const queryParts: string[] = ["trashed = false"];
    if (folderId) queryParts.push(`'${folderId}' in parents`);
    if (q) queryParts.push(`name contains '${String(q).replace(/'/g, "\\'")}'`);
    params.set("q", queryParts.join(" and "));
    params.set("fields", "nextPageToken, files(id, name, mimeType, size, modifiedTime, iconLink, webViewLink, parents)");
    params.set("orderBy", "modifiedTime desc");
    params.set("pageSize", String(pageSize ?? 100));
    if (pageToken) params.set("pageToken", pageToken);
    params.set("includeItemsFromAllDrives", "true");
    params.set("supportsAllDrives", "true");

    const res = await driveFetch(`/drive/v3/files?${params}`);
    const body = await res.text();
    return new Response(body, { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    if (e instanceof Response) return e;
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

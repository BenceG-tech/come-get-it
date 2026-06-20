// @ts-nocheck
import { driveFetch, driveGetContent, corsHeaders, requireAdmin } from "../_shared/drive.ts";
import { assertInScope } from "../_shared/drive-scope.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { supabase } = await requireAdmin(req);
    const { fileId } = await req.json();
    if (!fileId) return new Response(JSON.stringify({ error: "fileId required" }), { status: 400, headers: corsHeaders });
    await assertInScope(supabase, [fileId]);



    const metaRes = await driveFetch(`/drive/v3/files/${fileId}?fields=id,name,mimeType,size,modifiedTime,webViewLink`);
    if (!metaRes.ok) throw new Error(`Drive meta ${metaRes.status}`);
    const meta = await metaRes.json();
    const content = await driveGetContent(fileId, meta.mimeType);
    return new Response(JSON.stringify({ ...meta, content: content.slice(0, 50000) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    if (e instanceof Response) return e;
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

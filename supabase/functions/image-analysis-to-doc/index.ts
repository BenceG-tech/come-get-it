// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function md(doc: any, a: any, imageUrl: string | null): string {
  const lines: string[] = [];
  lines.push(`# ${doc.title ?? "Képelemzés"}`);
  if (doc.folder) lines.push(`*Mappa: ${doc.folder}*`);
  if (imageUrl) lines.push(`\n![${doc.title ?? "kép"}](${imageUrl})\n`);
  if (a.ai_description) lines.push(`## Leírás\n${a.ai_description}`);
  if (a.ai_mood) lines.push(`\n**Hangulat:** ${a.ai_mood}`);
  if (Array.isArray(a.ai_tags) && a.ai_tags.length) lines.push(`\n**Címkék:** ${a.ai_tags.map((t: string) => `#${t}`).join(" ")}`);
  if (Array.isArray(a.ai_dominant_colors) && a.ai_dominant_colors.length) lines.push(`\n**Domináns színek:** ${a.ai_dominant_colors.join(", ")}`);
  if (a.ai_suggested_alt) lines.push(`\n## SEO alt szöveg\n${a.ai_suggested_alt}`);
  if (a.ai_suggested_caption) lines.push(`\n## Caption\n${a.ai_suggested_caption}`);
  if (Array.isArray(a.ai_use_cases) && a.ai_use_cases.length) {
    lines.push(`\n## Felhasználási ötletek`);
    a.ai_use_cases.forEach((u: string) => lines.push(`- ${u}`));
  }
  const c = a.ai_suggested_copy;
  if (c && (c.instagram || c.facebook || c.landing_headline)) {
    lines.push(`\n## Copy javaslatok`);
    if (c.landing_headline) lines.push(`\n**Landing headline:** ${c.landing_headline}`);
    if (c.instagram) lines.push(`\n**Instagram:**\n${c.instagram}`);
    if (c.facebook) lines.push(`\n**Facebook:**\n${c.facebook}`);
  }
  return lines.join("\n");
}

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

    const { docId } = await req.json();
    if (!docId) return new Response(JSON.stringify({ error: "docId required" }), { status: 400, headers: corsHeaders });

    const { data: d, error } = await supabase.from("documents").select("*").eq("id", docId).maybeSingle();
    if (error || !d) throw new Error(error?.message ?? "Document not found");

    let imageUrl: string | null = null;
    if (d.storage_path) {
      if (d.storage_path.startsWith("http")) imageUrl = d.storage_path;
      else {
        const { data: s } = await supabase.storage.from("admin-docs").createSignedUrl(d.storage_path, 3600 * 24 * 7);
        imageUrl = s?.signedUrl ?? null;
      }
    }

    const markdown = md(d, d, imageUrl);
    const safeTitle = (d.title || "kepelemzes").replace(/[^a-z0-9-_]/gi, "_").slice(0, 60);
    const path = `ai-analyses/${user.id}/${Date.now()}_${safeTitle}.md`;
    const { error: upErr } = await supabase.storage.from("admin-docs").upload(path, new Blob([markdown], { type: "text/markdown" }), {
      contentType: "text/markdown",
      upsert: false,
    });
    if (upErr) throw new Error(upErr.message);

    const { data: newDoc, error: insErr } = await supabase.from("documents").insert({
      title: `AI elemzés: ${d.title}`,
      folder: "AI elemzések",
      category: d.category ?? "marketing",
      mime_type: "text/markdown",
      storage_path: path,
      content: markdown,
      linked_document_id: d.id,
      uploaded_by: user.id,
    }).select("id").single();
    if (insErr) throw new Error(insErr.message);

    return new Response(JSON.stringify({ id: newDoc.id, path }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

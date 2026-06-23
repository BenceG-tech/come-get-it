// @ts-nocheck
// Downloads files from admin-docs storage and backfills documents.content.
// - Text-ish mime types: decoded as UTF-8 directly.
// - PDF / images / DOCX: sent to Gemini via Lovable AI Gateway to extract markdown.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EXTRACT_SYSTEM = `Te egy dokumentum-kivonatoló vagy. A megadott fájlból nyerd ki a teljes, ember által olvasható szöveget magyar Markdown formátumban.
- Tartsd meg a címek, listák, táblázatok struktúráját.
- Ne adj hozzá saját kommentárt vagy összefoglalót.
- Ha kép, írd le tömören magyarul mi látható, majd ha van rajta szöveg, idézd.
- Max ~8000 karakter.`;

const TEXT_MIMES = new Set([
  "text/plain", "text/markdown", "text/csv", "text/html", "application/json",
  "application/xml", "text/xml", "text/x-markdown",
]);

const SUPPORTED_BINARY = new Set([
  "application/pdf",
  "image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif",
]);

function b64encode(bytes: Uint8Array): string {
  let s = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk) as any);
  }
  return btoa(s);
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

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const body = await req.json().catch(() => ({}));
    const docIds: string[] | null = Array.isArray(body.docIds) ? body.docIds : null;
    const limit = Math.min(Number(body.limit ?? 10), 25);
    const overwrite = !!body.overwrite;

    let q = admin.from("documents").select("id, title, storage_path, mime_type, content");
    if (docIds) q = q.in("id", docIds);
    else if (!overwrite) q = q.or("content.is.null,content.eq.");
    const { data: docs, error } = await q.limit(limit);
    if (error) throw error;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const results: any[] = [];

    for (const d of docs ?? []) {
      try {
        if (!d.storage_path) { results.push({ id: d.id, skipped: "no_storage_path" }); continue; }

        const { data: file, error: dlErr } = await admin.storage.from("admin-docs").download(d.storage_path);
        if (dlErr || !file) { results.push({ id: d.id, error: dlErr?.message ?? "download_failed" }); continue; }

        const mime = (d.mime_type || file.type || "").toLowerCase();
        let content: string | null = null;

        if (TEXT_MIMES.has(mime) || mime.startsWith("text/")) {
          const txt = await file.text();
          content = txt.slice(0, 60000);
        } else if (SUPPORTED_BINARY.has(mime)) {
          if (!LOVABLE_API_KEY) { results.push({ id: d.id, error: "LOVABLE_API_KEY missing" }); continue; }
          const buf = new Uint8Array(await file.arrayBuffer());
          if (buf.byteLength > 18 * 1024 * 1024) { results.push({ id: d.id, skipped: "file_too_large" }); continue; }
          const b64 = b64encode(buf);
          const dataUrl = `data:${mime};base64,${b64}`;

          const userParts: any[] = [{ type: "text", text: `Doksi címe: ${d.title}\nNyerd ki a szöveget magyar markdownban.` }];
          if (mime.startsWith("image/")) {
            userParts.push({ type: "image_url", image_url: { url: dataUrl } });
          } else {
            // PDF: most Gemini-compatible gateways accept image_url with PDF data URL.
            userParts.push({ type: "image_url", image_url: { url: dataUrl } });
          }

          const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: EXTRACT_SYSTEM },
                { role: "user", content: userParts },
              ],
            }),
          });
          if (!up.ok) { results.push({ id: d.id, error: (await up.text()).slice(0, 200) }); continue; }
          const j = await up.json();
          content = j?.choices?.[0]?.message?.content ?? null;
        } else {
          results.push({ id: d.id, skipped: `unsupported_mime:${mime}` });
          continue;
        }

        if (content && content.trim().length > 0) {
          await admin.from("documents").update({ content: content.trim() }).eq("id", d.id);
          results.push({ id: d.id, length: content.length });
        } else {
          results.push({ id: d.id, skipped: "empty_content" });
        }
      } catch (e) {
        results.push({ id: d.id, error: String(e?.message ?? e) });
      }
    }

    return new Response(JSON.stringify({ count: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { decodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-seed-key",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const seedKey = req.headers.get("x-seed-key");
    const expected = Deno.env.get("LOVABLE_API_KEY");
    if (!seedKey || !expected || seedKey !== expected) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const url = Deno.env.get("SUPABASE_URL")!;
    const svc = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(url, svc);

    const body = await req.json();
    const action = body.action;

    if (action === "init") {
      const { data: existing } = await admin.storage.getBucket("admin-docs");
      if (!existing) {
        const { error } = await admin.storage.createBucket("admin-docs", { public: false, fileSizeLimit: 52428800 });
        if (error && !String(error.message).includes("exists")) {
          return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }
      return new Response(JSON.stringify({ ok: true, bucket: "admin-docs" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "upload") {
      const { path, contentBase64, mime, title, description, when_to_use, category, folder, file_size_bytes } = body;
      if (!path || !contentBase64 || !title) {
        return new Response(JSON.stringify({ error: "missing fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const bytes = decodeBase64(contentBase64);
      const { error: upErr } = await admin.storage.from("admin-docs").upload(path, bytes, {
        contentType: mime || "application/octet-stream",
        upsert: true,
      });
      if (upErr) {
        return new Response(JSON.stringify({ error: upErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Upsert documents row keyed by storage_path
      const { data: existing } = await admin.from("documents").select("id").eq("storage_path", path).maybeSingle();
      const row = {
        title,
        description: description ?? null,
        when_to_use: when_to_use ?? null,
        category: category ?? "other",
        folder: folder ?? null,
        storage_path: path,
        mime_type: mime ?? null,
        file_size_bytes: file_size_bytes ?? null,
        is_ai_generated: true,
      };
      if (existing) {
        await admin.from("documents").update(row).eq("id", existing.id);
      } else {
        await admin.from("documents").insert(row);
      }
      return new Response(JSON.stringify({ ok: true, path }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

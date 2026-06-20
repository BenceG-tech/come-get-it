// @ts-nocheck
// Shared helper to call the Google Drive connector gateway.
const GATEWAY = "https://connector-gateway.lovable.dev/google_drive";

export async function driveFetch(path: string, init: RequestInit = {}) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
  const DRIVE_KEY = Deno.env.get("GOOGLE_DRIVE_API_KEY")!;
  const headers = new Headers(init.headers ?? {});
  headers.set("Authorization", `Bearer ${LOVABLE_API_KEY}`);
  headers.set("X-Connection-Api-Key", DRIVE_KEY);
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  const res = await fetch(`${GATEWAY}${path}`, { ...init, headers });
  return res;
}

// Export a Google Docs/Sheets/Slides file as plain text, or download binary file content.
export async function driveGetContent(fileId: string, mimeType: string): Promise<string> {
  let url: string;
  if (mimeType === "application/vnd.google-apps.document") {
    url = `/drive/v3/files/${fileId}/export?mimeType=text/plain`;
  } else if (mimeType === "application/vnd.google-apps.spreadsheet") {
    url = `/drive/v3/files/${fileId}/export?mimeType=text/csv`;
  } else if (mimeType === "application/vnd.google-apps.presentation") {
    url = `/drive/v3/files/${fileId}/export?mimeType=text/plain`;
  } else if (mimeType.startsWith("text/") || mimeType === "application/json") {
    url = `/drive/v3/files/${fileId}?alt=media`;
  } else {
    // Try plain download; may be binary (pdf/docx) which we won't OCR here.
    url = `/drive/v3/files/${fileId}?alt=media`;
  }
  const res = await driveFetch(url);
  if (!res.ok) throw new Error(`Drive content fetch failed ${res.status}: ${(await res.text()).slice(0, 200)}`);
  // For binary files, return a short notice instead of garbled bytes.
  const isText = mimeType.startsWith("text/") || mimeType.includes("google-apps") || mimeType === "application/json";
  if (!isText) return `[Bináris fájl: ${mimeType}. Tartalom nem szöveges, csak metaadat alapján elemezhető.]`;
  return await res.text();
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export async function requireAdmin(req: Request) {
  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.45.0");
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
  if (!isAdmin) throw new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
  return { supabase, user };
}

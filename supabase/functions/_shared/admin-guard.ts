// @ts-nocheck
// Server-side authorization for privileged edge functions.
// Allowed callers:
//  1. Signed-in users holding the 'admin' role (checked via public.has_role)
//  2. Other edge functions using the service role key
//  3. pg_cron jobs sending the Vault-held secret in the x-cron-secret header
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const guardCors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-secret, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Content-Type": "application/json",
};

export type GuardResult =
  | { ok: true; kind: "admin"; userId: string }
  | { ok: true; kind: "service" | "cron"; userId: null }
  | { ok: false; response: Response };

function deny(status: number, error: string): GuardResult {
  return { ok: false, response: new Response(JSON.stringify({ error }), { status, headers: guardCors }) };
}

function safeEqual(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function requireAdminOrSystem(req: Request): Promise<GuardResult> {
  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (token && safeEqual(token, serviceKey)) return { ok: true, kind: "service", userId: null };

  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret) {
    const { data, error } = await admin.rpc("verify_edge_cron_secret", { p_secret: cronSecret });
    if (!error && data === true) return { ok: true, kind: "cron", userId: null };
    return deny(401, "unauthorized");
  }

  if (!token) return deny(401, "unauthorized");
  const { data: { user } = { user: null } } = await admin.auth.getUser(token);
  if (!user) return deny(401, "unauthorized");
  const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
  if (!isAdmin) return deny(403, "forbidden");
  return { ok: true, kind: "admin", userId: user.id };
}

// @ts-nocheck
// Server-side authorization for privileged edge functions.
// Allowed callers:
//  1. Signed-in users holding the 'admin' role (checked via public.has_role)
//  2. Other edge functions using the service role key
//  3. pg_cron jobs sending the Vault-held secret in the x-cron-secret header
// Everything else fails closed (401 / 403).
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
  | { ok: false; status: 401 | 403; response: Response };

export interface GuardDeps {
  serviceKey: string;
  verifyCronSecret: (secret: string) => Promise<boolean>;
  getUserId: (token: string) => Promise<string | null>;
  isAdmin: (userId: string) => Promise<boolean>;
}

function deny(status: 401 | 403, error: string): GuardResult {
  return { ok: false, status, response: new Response(JSON.stringify({ error }), { status, headers: guardCors }) };
}

export function safeEqual(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function authorize(req: Request, deps: GuardDeps): Promise<GuardResult> {
  try {
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
    if (token && deps.serviceKey && safeEqual(token, deps.serviceKey)) return { ok: true, kind: "service", userId: null };

    const cronSecret = req.headers.get("x-cron-secret");
    if (cronSecret !== null) {
      return (await deps.verifyCronSecret(cronSecret)) === true
        ? { ok: true, kind: "cron", userId: null }
        : deny(401, "unauthorized");
    }

    if (!token) return deny(401, "unauthorized");
    const userId = await deps.getUserId(token);
    if (!userId) return deny(401, "unauthorized");
    if ((await deps.isAdmin(userId)) !== true) return deny(403, "forbidden");
    return { ok: true, kind: "admin", userId };
  } catch (_e) {
    return deny(401, "unauthorized");
  }
}

export function defaultDeps(): GuardDeps {
  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  return {
    serviceKey,
    verifyCronSecret: async (secret) => {
      const { data, error } = await admin.rpc("verify_edge_cron_secret", { p_secret: secret });
      return !error && data === true;
    },
    getUserId: async (token) => {
      const { data, error } = await admin.auth.getUser(token);
      return error ? null : data?.user?.id ?? null;
    },
    isAdmin: async (userId) => {
      const { data, error } = await admin.rpc("has_role", { _user_id: userId, _role: "admin" });
      return !error && data === true;
    },
  };
}

export function requireAdminOrSystem(req: Request): Promise<GuardResult> {
  return authorize(req, defaultDeps());
}

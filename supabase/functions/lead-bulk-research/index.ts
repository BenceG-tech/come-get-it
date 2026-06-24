// Bulk lead research — invokes lead-auto-research concurrently (max 5 parallel)
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { partner_ids } = await req.json();
    if (!Array.isArray(partner_ids) || partner_ids.length === 0) {
      return new Response(JSON.stringify({ error: "partner_ids[] required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(SUPABASE_URL, SERVICE_KEY);

    const CONCURRENCY = 4;
    const queue = [...partner_ids];
    let done = 0, failed = 0;

    // Run in background so we never hit the 150s request timeout for big batches.
    const runAll = async () => {
      const worker = async () => {
        while (queue.length) {
          const id = queue.shift();
          if (!id) break;
          try {
            const r = await fetch(`${SUPABASE_URL}/functions/v1/lead-auto-research`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${SERVICE_KEY}` },
              body: JSON.stringify({ partner_id: id }),
            });
            if (r.ok) done++; else failed++;
            try { await r.text(); } catch (_) {}
          } catch (_e) { failed++; }
        }
      };
      await Promise.all(Array.from({ length: Math.min(CONCURRENCY, partner_ids.length) }, worker));
      try {
        await sb.functions.invoke("lead-grade-ai-bulk", { body: { partner_ids } });
      } catch (_e) { /* non-blocking */ }
    };

    // EdgeRuntime.waitUntil keeps the worker alive past the response.
    // @ts-ignore - EdgeRuntime is provided by Supabase runtime
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(runAll());
    } else {
      // Fallback: fire-and-forget
      runAll().catch(() => {});
    }

    return new Response(JSON.stringify({ ok: true, queued: partner_ids.length, status: "running_in_background" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

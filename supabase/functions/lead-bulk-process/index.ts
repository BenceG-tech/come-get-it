// lead-bulk-process — Full pipeline (Research → Score → Grade) in chunks, background.
// Avoids 504s and rate-limits: 10 lead / chunk, 4 parallel research, 2s pause between chunks.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const CHUNK = 10;
const RESEARCH_PARALLEL = 4;
const CHUNK_PAUSE_MS = 2000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { partner_ids, skip_research = false } = await req.json();
    if (!Array.isArray(partner_ids) || partner_ids.length === 0) {
      return new Response(JSON.stringify({ error: "partner_ids[] required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(SUPABASE_URL, SERVICE_KEY);

    // Create task_runs row for progress tracking
    const { data: taskRow } = await sb.from("task_runs").insert({
      task_key: "lead_bulk_process",
      status: "running",
      input: { partner_ids, total: partner_ids.length, skip_research },
      output: { processed: 0, researched: 0, scored: 0, graded: 0, failed: 0 },
    }).select("id").maybeSingle();
    const taskId = taskRow?.id;

    const invokeFn = async (name: string, body: unknown) => {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${SERVICE_KEY}` },
        body: JSON.stringify(body),
      });
      const text = await r.text();
      if (!r.ok) throw new Error(`${name} ${r.status}: ${text.slice(0, 200)}`);
      try { return JSON.parse(text); } catch { return null; }
    };

    const runAll = async () => {
      const chunks: string[][] = [];
      for (let i = 0; i < partner_ids.length; i += CHUNK) chunks.push(partner_ids.slice(i, i + CHUNK));

      let processed = 0, researched = 0, scored = 0, graded = 0, failed = 0;

      for (const chunk of chunks) {
        // 1) Research chunk in parallel (RESEARCH_PARALLEL)
        if (!skip_research) {
          const queue = [...chunk];
          const worker = async () => {
            while (queue.length) {
              const id = queue.shift();
              if (!id) break;
              try {
                await invokeFn("lead-auto-research", { partner_id: id });
                researched++;
              } catch (e) { console.warn("research fail", id, e); failed++; }
            }
          };
          await Promise.all(Array.from({ length: Math.min(RESEARCH_PARALLEL, chunk.length) }, worker));
        }

        // 2) Score the chunk (deterministic + AI overlay, background-safe)
        try {
          await invokeFn("score-lead", { partner_ids: chunk, background: false });
          scored += chunk.length;
        } catch (e) { console.warn("score fail chunk", e); failed += chunk.length; }

        // 3) Grade the chunk (1 AI call per chunk — keeps prompt size manageable)
        try {
          await invokeFn("lead-grade-ai-bulk", { partner_ids: chunk });
          graded += chunk.length;
        } catch (e) { console.warn("grade fail chunk", e); failed += chunk.length; }

        processed += chunk.length;

        // Progress update
        if (taskId) {
          await sb.from("task_runs").update({
            output: { processed, researched, scored, graded, failed, total: partner_ids.length },
          }).eq("id", taskId);
        }

        // Throttle between chunks
        if (chunks.indexOf(chunk) < chunks.length - 1) {
          await new Promise((r) => setTimeout(r, CHUNK_PAUSE_MS));
        }
      }

      if (taskId) {
        await sb.from("task_runs").update({
          status: "completed",
          finished_at: new Date().toISOString(),
          output: { processed, researched, scored, graded, failed, total: partner_ids.length },
        }).eq("id", taskId);
      }
    };

    // @ts-ignore - EdgeRuntime
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(runAll().catch((e) => console.error("bulk-process fatal", e)));
    } else {
      runAll().catch((e) => console.error("bulk-process fatal", e));
    }

    return new Response(JSON.stringify({
      ok: true,
      queued: partner_ids.length,
      chunks: Math.ceil(partner_ids.length / CHUNK),
      eta_seconds: Math.ceil(partner_ids.length / CHUNK) * (skip_research ? 8 : 60),
      task_run_id: taskId,
      status: "running_in_background",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

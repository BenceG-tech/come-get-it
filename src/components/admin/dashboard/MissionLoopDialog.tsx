import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, Brain, Wrench, MessageSquare, Sparkles, HandHelping } from "lucide-react";
import { toast } from "sonner";

type Iteration = {
  at: string;
  think?: string;
  tool: string;
  input?: any;
  observation?: any;
  awaiting_human?: boolean;
  human_response?: any;
};

type Run = {
  id: string;
  goal: string | null;
  status: string;
  iterations: Iteration[];
  human_prompt: { question: string; steps: string[]; why?: string } | null;
  final_summary: string | null;
  error: string | null;
  tool_calls_count: number;
  max_iterations: number;
};

const TOOL_ICONS: Record<string, JSX.Element> = {
  search_partners: <span className="text-blue-400">🔍</span>,
  bulk_pipeline: <span className="text-cyan-400">⚡</span>,
  draft_outreach: <span className="text-violet-400">📧</span>,
  check_inbox: <span className="text-amber-400">📥</span>,
  mission_snapshot: <span className="text-emerald-400">🎯</span>,
  ask_human: <HandHelping className="h-4 w-4 text-yellow-400" />,
  finish: <CheckCircle2 className="h-4 w-4 text-green-400" />,
};

export default function MissionLoopDialog({
  open, onOpenChange, goal, task,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  goal?: string;
  task?: any;
}) {
  const [runId, setRunId] = useState<string | null>(null);
  const [run, setRun] = useState<Run | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resuming, setResuming] = useState(false);

  // Start loop
  useEffect(() => {
    if (!open || runId) return;
    let cancelled = false;
    (async () => {
      setError(null); setRun(null);
      const { data, error } = await supabase.functions.invoke("agent-loop", {
        body: goal ? { goal } : { task },
      });
      if (cancelled) return;
      if (error) { setError(error.message); return; }
      setRunId((data as any)?.run_id ?? null);
    })();
    return () => { cancelled = true; };
  }, [open]);

  // Reset on close
  useEffect(() => {
    if (!open) { setRunId(null); setRun(null); setError(null); }
  }, [open]);

  // Realtime poll
  useEffect(() => {
    if (!runId) return;
    const load = async () => {
      const { data } = await supabase.from("task_runs").select("*").eq("id", runId).maybeSingle();
      if (data) setRun(data as any);
    };
    load();
    const ch = supabase.channel(`mission-loop-${runId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "task_runs", filter: `id=eq.${runId}` }, (payload) => {
        setRun(payload.new as any);
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [runId]);

  const resumeWithHumanOk = async () => {
    if (!runId) return;
    setResuming(true);
    try {
      const { error } = await supabase.functions.invoke("agent-loop", {
        body: { action: "resume", run_id: runId, human_response: { ok: true, note: "Felhasználó megerősítette" } },
      });
      if (error) throw error;
      toast.success("Folytatom…");
    } catch (e: any) {
      toast.error(e.message);
    } finally { setResuming(false); }
  };

  const status = run?.status ?? "starting";
  const iterations = run?.iterations ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-electric-300" />
            Mission Loop
            <Badge variant="outline" className="ml-2 text-[10px]">{status}</Badge>
            {run && <span className="text-[11px] text-nf-text-muted ml-auto">{run.tool_calls_count}/{run.max_iterations} lépés</span>}
          </DialogTitle>
        </DialogHeader>

        {/* Goal */}
        <div className="rounded-lg bg-nf-surface border border-nf-border p-3">
          <div className="text-[10px] uppercase tracking-wider text-nf-text-muted mb-1">Cél</div>
          <div className="text-sm font-medium whitespace-pre-line">{run?.goal ?? goal ?? task?.title ?? "…"}</div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/40 p-3 flex gap-2 items-start">
            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
            <div className="text-sm text-red-300">{error}</div>
          </div>
        )}

        {/* Iterations stream */}
        <div className="space-y-2">
          {iterations.map((it, i) => (
            <div key={i} className="rounded-lg border border-nf-border bg-nf-surface-alt p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-nf-text-muted">
                <span className="font-mono">#{i + 1}</span>
                <span className="flex items-center gap-1">{TOOL_ICONS[it.tool] ?? <Wrench className="h-3 w-3" />} <span className="font-mono">{humanToolName(it.tool)}</span></span>
                <span className="ml-auto">{new Date(it.at).toLocaleTimeString("hu-HU")}</span>
              </div>
              {it.think && it.think !== "(nincs explicit think)" && (
                <div className="flex gap-2 text-sm">
                  <Brain className="h-4 w-4 text-electric-300 shrink-0 mt-0.5" />
                  <div className="text-nf-text">{it.think}</div>
                </div>
              )}
              {humanInput(it.tool, it.input) && (
                <div className="text-[11px] text-nf-text-muted">
                  <span className="text-nf-text-muted">→ </span>{humanInput(it.tool, it.input)}
                </div>
              )}
              {it.observation && (
                <div className="text-sm text-nf-text">
                  {humanObservation(it.tool, it.observation)}
                </div>
              )}
            </div>
          ))}

          {status === "running" && (
            <div className="flex items-center gap-2 text-sm text-nf-text-muted p-3">
              <Loader2 className="h-4 w-4 animate-spin" /> AI dolgozik…
            </div>
          )}
        </div>

        {/* Human-in-the-loop prompt */}
        {status === "awaiting_human" && run?.human_prompt && (
          <div className="rounded-lg bg-yellow-500/10 border-2 border-yellow-500/50 p-4 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-yellow-300">
              <HandHelping className="h-5 w-5" /> Az AI rád vár
            </div>
            <div className="text-sm text-white">{run.human_prompt.question}</div>
            {run.human_prompt.why && <div className="text-xs text-yellow-200/80 italic">Miért: {run.human_prompt.why}</div>}
            <ol className="space-y-1.5 text-sm pl-1">
              {run.human_prompt.steps?.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-yellow-400 font-mono">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <Button onClick={resumeWithHumanOk} disabled={resuming} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold">
              {resuming ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />} Kész — folytasd
            </Button>
          </div>
        )}

        {/* Completion */}
        {status === "completed" && run?.final_summary && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/40 p-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-emerald-300">
              <CheckCircle2 className="h-5 w-5" /> Kész
            </div>
            <div className="text-sm text-white whitespace-pre-line">{run.final_summary}</div>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="mt-2">Bezárás</Button>
          </div>
        )}

        {status === "failed" && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/40 p-3 text-sm text-red-300">
            {run?.error ?? "Ismeretlen hiba"}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

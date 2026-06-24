import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, Mail, ListChecks, ChevronRight, Send } from "lucide-react";
import { toast } from "sonner";

type Step = { at: string; message: string; data?: any };
type Generated =
  | { kind: "enrollment_draft"; enrollment_id: string; partner_id: string; partner_name: string; subject: string; body_preview: string }
  | { kind: "pipeline_task"; task_id: string; title: string };

export default function TaskAutopilotDialog({
  open, onOpenChange, task, taskIndex,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task: any;
  taskIndex: number;
}) {
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("starting");
  const [steps, setSteps] = useState<Step[]>([]);
  const [generated, setGenerated] = useState<Generated[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [approved, setApproved] = useState<Set<string>>(new Set());

  // Start the run when opened
  useEffect(() => {
    if (!open || runId) return;
    let cancelled = false;
    (async () => {
      setStatus("starting"); setSteps([]); setGenerated([]); setError(null); setApproved(new Set());
      const { data, error } = await supabase.functions.invoke("task-autopilot", {
        body: { task, task_index: taskIndex },
      });
      if (cancelled) return;
      if (error) { setError(error.message); setStatus("failed"); return; }
      setRunId((data as any)?.run_id ?? null);
      setStatus("running");
    })();
    return () => { cancelled = true; };
  }, [open]);

  // Reset on close
  useEffect(() => {
    if (!open) { setRunId(null); setSteps([]); setGenerated([]); setStatus("starting"); setError(null); setApproved(new Set()); }
  }, [open]);

  // Realtime subscribe to the run
  useEffect(() => {
    if (!runId) return;
    const load = async () => {
      const { data } = await supabase.from("task_runs").select("status, steps, generated, error").eq("id", runId).maybeSingle();
      if (!data) return;
      setStatus(data.status);
      setSteps(Array.isArray(data.steps) ? (data.steps as unknown as Step[]) : []);
      setGenerated(Array.isArray(data.generated) ? (data.generated as unknown as Generated[]) : []);
      if (data.error) setError(data.error);
    };
    load();
    const ch = supabase.channel(`task_run_${runId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "task_runs", filter: `id=eq.${runId}` }, (p) => {
        const row = p.new as any;
        setStatus(row.status);
        setSteps(Array.isArray(row.steps) ? row.steps : []);
        setGenerated(Array.isArray(row.generated) ? row.generated : []);
        if (row.error) setError(row.error);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [runId]);

  const approveOne = async (g: Generated) => {
    if (g.kind !== "enrollment_draft") return;
    setApproving(g.enrollment_id);
    const { error } = await supabase.from("outreach_enrollments")
      .update({ status: "active", next_run_at: new Date().toISOString() })
      .eq("id", g.enrollment_id);
    setApproving(null);
    if (error) { toast.error(error.message); return; }
    setApproved((s) => new Set(s).add(g.enrollment_id));
    toast.success(`${g.partner_name} aktiválva — első email a következő tick-nél megy`);
  };

  const approveAll = async () => {
    const drafts = generated.filter((g): g is Extract<Generated,{kind:"enrollment_draft"}> => g.kind === "enrollment_draft" && !approved.has(g.enrollment_id));
    if (!drafts.length) return;
    const { error } = await supabase.from("outreach_enrollments")
      .update({ status: "active", next_run_at: new Date().toISOString() })
      .in("id", drafts.map((d) => d.enrollment_id));
    if (error) { toast.error(error.message); return; }
    setApproved((s) => { const n = new Set(s); drafts.forEach((d) => n.add(d.enrollment_id)); return n; });
    toast.success(`${drafts.length} enrollment aktiválva`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>AI autopilot</span>
            <Badge variant="outline" className="text-[10px]">{status}</Badge>
          </DialogTitle>
          <div className="text-sm text-nf-text-muted mt-1">{task?.title}</div>
        </DialogHeader>

        {/* Steps log */}
        <div className="space-y-1.5 border border-nf-border rounded-lg p-3 bg-nf-surface-alt/30 max-h-64 overflow-y-auto">
          {steps.length === 0 && status !== "failed" && (
            <div className="flex items-center gap-2 text-sm text-nf-text-muted"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Indítás…</div>
          )}
          {steps.map((s, i) => (
            <div key={i} className="text-xs flex items-start gap-2">
              <ChevronRight className="h-3 w-3 mt-0.5 text-electric-300 shrink-0" />
              <div>
                <span className="text-nf-text">{s.message}</span>
                <span className="text-nf-text-muted ml-2">{new Date(s.at).toLocaleTimeString("hu-HU")}</span>
              </div>
            </div>
          ))}
          {status === "running" && (
            <div className="flex items-center gap-2 text-xs text-electric-300 pt-1">
              <Loader2 className="h-3 w-3 animate-spin" /> dolgozom…
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 text-xs text-red-400 mt-2">
              <AlertCircle className="h-3.5 w-3.5 mt-0.5" /> {error}
            </div>
          )}
        </div>

        {/* Generated artifacts */}
        {generated.length > 0 && (
          <div className="space-y-2 mt-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-electric-300" /> Eredmények ({generated.length})
              </div>
              {generated.some((g) => g.kind === "enrollment_draft" && !approved.has(g.enrollment_id)) && (
                <Button size="sm" variant="neon" onClick={approveAll}>
                  <Send className="h-3.5 w-3.5 mr-1.5" /> Mind aktiválás
                </Button>
              )}
            </div>
            {generated.map((g, i) => (
              <div key={i} className="border border-nf-border rounded-lg p-3 bg-nf-surface-alt/20">
                {g.kind === "enrollment_draft" ? (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-electric-300" />
                          <Link to={`/admin/partners/${g.partner_id}`} className="font-medium text-sm hover:text-electric-300">
                            {g.partner_name}
                          </Link>
                        </div>
                        <div className="text-xs text-nf-text mt-1 font-medium">{g.subject}</div>
                        <div className="text-xs text-nf-text-muted mt-1 line-clamp-3 whitespace-pre-wrap">{g.body_preview}</div>
                      </div>
                      {approved.has(g.enrollment_id) ? (
                        <Badge variant="outline" className="text-electric-300 border-electric-300/40 shrink-0">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> aktív
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => approveOne(g)} disabled={approving === g.enrollment_id} className="shrink-0">
                          {approving === g.enrollment_id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Aktivál"}
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <ListChecks className="h-3.5 w-3.5 text-electric-300" />
                    <span>Pipeline task: <span className="font-medium">{g.title}</span></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {status === "awaiting_approval" && generated.length === 0 && (
          <div className="text-sm text-nf-text-muted py-4 text-center">
            Nem találtam megfelelő jelöltet a feladathoz. Próbáld pontosítani a daily focus task leírását.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

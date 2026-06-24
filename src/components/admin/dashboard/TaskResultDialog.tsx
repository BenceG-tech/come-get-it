import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Send, X, Edit3, ExternalLink, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: { title: string; why?: string; suggested_action?: string };
};

type Run = {
  id: string;
  status: string;
  recipe_type?: string;
  recipe_params?: any;
  progress?: { step: number; total: number; label: string };
  result_items?: any[];
  final_summary?: string;
  error?: string;
};

const RECIPE_LABEL: Record<string, string> = {
  outreach: "Outreach kampány",
  research: "Lead kutatás",
  followup: "Follow-up",
  inbox: "Inbox átnézés",
  custom: "Egyedi feladat",
};

export default function TaskResultDialog({ open, onOpenChange, task }: Props) {
  const [run, setRun] = useState<Run | null>(null);
  const [starting, setStarting] = useState(false);

  // Start the run when dialog opens
  useEffect(() => {
    if (!open || run) return;
    (async () => {
      setStarting(true);
      try {
        const goal = `${task.title}${task.why ? ` — ${task.why}` : ""}${task.suggested_action ? `\nJavasolt: ${task.suggested_action}` : ""}`;
        const { data, error } = await supabase.functions.invoke("task-run-recipe", { body: { goal, task } });
        if (error) throw error;
        setRun({ id: (data as any).run_id, status: "running", result_items: [], progress: { step: 0, total: 100, label: "Indul…" } });
      } catch (e: any) {
        toast.error("Nem indult el: " + (e?.message ?? e));
        onOpenChange(false);
      } finally {
        setStarting(false);
      }
    })();
  }, [open]);

  // Realtime subscription to updates
  useEffect(() => {
    if (!run?.id) return;
    const ch = supabase
      .channel(`task_run_${run.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "task_runs", filter: `id=eq.${run.id}` }, (payload) => {
        setRun((cur) => cur ? { ...cur, ...(payload.new as any) } : cur);
      })
      .subscribe();
    // Initial fetch too in case we missed events
    supabase.from("task_runs").select("*").eq("id", run.id).maybeSingle().then(({ data }) => {
      if (data) setRun((cur) => cur ? { ...cur, ...(data as any) } : cur);
    });
    return () => { supabase.removeChannel(ch); };
  }, [run?.id]);

  // Reset when closed
  useEffect(() => { if (!open) setRun(null); }, [open]);

  const items = run?.result_items ?? [];
  const progressPct = run?.progress ? Math.min(100, Math.round((run.progress.step / Math.max(1, run.progress.total)) * 100)) : 0;
  const isDone = run?.status === "completed" || run?.status === "failed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto border-electric-300/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-electric-300" />
            {task.title}
          </DialogTitle>
          <DialogDescription>
            {run?.recipe_type ? RECIPE_LABEL[run.recipe_type] ?? run.recipe_type : "AI feldolgozza a feladatot…"}
            {run?.recipe_params?.city && <> · {run.recipe_params.city}</>}
            {run?.recipe_params?.category && <> · {run.recipe_params.category}</>}
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        {!isDone && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-nf-text-muted">
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin text-electric-300" />
                {starting ? "Indítás…" : run?.progress?.label ?? "Töltés…"}
              </span>
              {run?.progress && <span>{run.progress.step}/{run.progress.total}</span>}
            </div>
            <Progress value={progressPct} className="h-1" />
          </div>
        )}

        {/* Summary banner when done */}
        {isDone && run?.final_summary && (
          <div className={`p-3 rounded-lg border text-sm ${run.status === "failed" ? "border-red-400/40 bg-red-500/5" : "border-electric-300/30 bg-electric-300/5"}`}>
            <div className="flex items-start gap-2">
              {run.status === "failed" ? <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> : <CheckCircle2 className="h-4 w-4 text-electric-300 shrink-0 mt-0.5" />}
              <div>{run.final_summary}</div>
            </div>
          </div>
        )}

        {/* Result items */}
        <div className="space-y-2">
          {items.length === 0 && !isDone && (
            <div className="text-sm text-nf-text-muted text-center py-4">Az AI dolgozik…</div>
          )}
          {items.map((item, i) => (
            <ResultCard key={i} runId={run!.id} item={item} index={i} onUpdate={(patch) => {
              setRun((cur) => {
                if (!cur) return cur;
                const next = [...(cur.result_items ?? [])];
                next[i] = { ...next[i], ...patch };
                return { ...cur, result_items: next };
              });
            }} />
          ))}
        </div>

        {isDone && (
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Bezárás</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─────────────── Result card variants ───────────────

function ResultCard({ runId, item, index, onUpdate }: { runId: string; item: any; index: number; onUpdate: (patch: any) => void }) {
  if (item.kind === "outreach_draft") return <OutreachDraftCard runId={runId} item={item} index={index} onUpdate={onUpdate} />;
  if (item.kind === "followup_draft") return <OutreachDraftCard runId={runId} item={item} index={index} onUpdate={onUpdate} isFollowup />;
  if (item.kind === "lead_summary") return <LeadSummaryCard item={item} onUpdate={onUpdate} />;
  if (item.kind === "inbox_item") return <InboxItemCard item={item} onUpdate={onUpdate} />;
  return null;
}

function GradeBadge({ grade, score }: { grade?: string; score?: number }) {
  if (!grade) return null;
  const color = grade === "A" ? "bg-electric-300/20 text-electric-300 border-electric-300/40"
    : grade === "B" ? "bg-blue-500/20 text-blue-400 border-blue-400/40"
    : "bg-nf-text-muted/20 text-nf-text-muted border-nf-border";
  return <Badge variant="outline" className={`${color} text-[10px] h-5`}>{grade}{score ? ` · ${Math.round(score)}` : ""}</Badge>;
}

function OutreachDraftCard({ runId, item, index, onUpdate, isFollowup }: { runId: string; item: any; index: number; onUpdate: (p: any) => void; isFollowup?: boolean }) {
  const [editing, setEditing] = useState(false);
  const [subject, setSubject] = useState(item.subject ?? "");
  const [body, setBody] = useState(item.body ?? "");
  const [sending, setSending] = useState(false);

  const updateAction = async (action: string, patch: any = {}) => {
    onUpdate({ action, ...patch });
    const { data } = await supabase.from("task_runs").select("result_items").eq("id", runId).maybeSingle();
    const arr: any[] = Array.isArray(data?.result_items) ? [...(data!.result_items as any[])] : [];
    arr[index] = { ...(arr[index] ?? {}), action, ...patch };
    await supabase.from("task_runs").update({ result_items: arr }).eq("id", runId);
  };

  const send = async () => {
    if (!item.lead?.id) return;
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-partner-email", {
        body: { partner_ids: [item.lead.id], subject_override: subject, body_override: body },
      });
      if (error) throw error;
      toast.success(`Elküldve: ${item.lead.company_name}`);
      await updateAction("sent", { subject, body });
      setEditing(false);
    } catch (e: any) {
      toast.error("Küldés hiba: " + (e?.message ?? e));
    }
    setSending(false);
  };

  const skip = async () => { await updateAction("skipped"); toast.message("Kihagyva"); };

  if (item.error) {
    return (
      <div className="p-3 rounded-lg border border-red-400/40 bg-red-500/5 text-sm">
        <div className="font-medium">{item.lead?.company_name ?? "Lead"}</div>
        <div className="text-xs text-red-400 mt-1">{item.error}</div>
      </div>
    );
  }

  const isDone = item.action === "sent" || item.action === "skipped";

  return (
    <div className={`p-3 rounded-lg border bg-nf-surface-alt/40 ${isDone ? "opacity-60" : "border-nf-border"}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{item.lead?.company_name}</span>
            <GradeBadge grade={item.lead?.lead_grade} score={item.lead?.lead_score} />
            {isFollowup && <Badge variant="outline" className="text-[10px] h-5">Follow-up</Badge>}
            {item.action === "sent" && <Badge className="bg-electric-300/20 text-electric-300 text-[10px] h-5"><CheckCircle2 className="h-2.5 w-2.5 mr-1" />Elküldve</Badge>}
            {item.action === "skipped" && <Badge variant="outline" className="text-[10px] h-5">Kihagyva</Badge>}
          </div>
          <div className="text-[11px] text-nf-text-muted mt-0.5">{item.lead?.email} · {item.lead?.city} · {item.lead?.category}</div>
        </div>
        <Link to={`/admin/partners/${item.lead?.id}`} className="text-electric-300 hover:underline shrink-0">
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {editing ? (
        <div className="space-y-2">
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Tárgy" className="h-8 text-sm" />
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} className="text-sm" />
        </div>
      ) : (
        <div className="space-y-1">
          <div className="text-sm font-medium">{subject}</div>
          <div className="text-xs text-nf-text-muted whitespace-pre-wrap line-clamp-4">{body}</div>
        </div>
      )}

      {!isDone && (
        <div className="flex gap-1.5 mt-2.5">
          <Button size="sm" variant="neon" onClick={send} disabled={sending} className="h-7 text-xs">
            <Send className="h-3 w-3 mr-1" /> {sending ? "Küldés…" : "Küldés"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setEditing(!editing)} className="h-7 text-xs">
            <Edit3 className="h-3 w-3 mr-1" /> {editing ? "Mégse" : "Szerkesztés"}
          </Button>
          <Button size="sm" variant="ghost" onClick={skip} className="h-7 text-xs text-nf-text-muted">
            <X className="h-3 w-3 mr-1" /> Kihagy
          </Button>
        </div>
      )}
    </div>
  );
}

function LeadSummaryCard({ item, onUpdate }: { item: any; onUpdate: (p: any) => void }) {
  const queue = () => { toast.success("Felvéve az outreach queue-ba (TODO: implementáljuk)"); onUpdate({ action: "queued_outreach" }); };
  return (
    <div className="p-3 rounded-lg border border-nf-border bg-nf-surface-alt/40">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{item.lead?.company_name}</span>
            <GradeBadge grade={item.lead?.lead_grade} score={item.lead?.lead_score} />
            <Badge variant="outline" className="text-[10px] h-5">{item.lead?.status}</Badge>
          </div>
          <div className="text-[11px] text-nf-text-muted mt-0.5">
            {item.lead?.city} · {item.lead?.category}
            {item.lead?.email && <> · {item.lead.email}</>}
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <Link to={`/admin/partners/${item.lead?.id}`}>
            <Button size="sm" variant="outline" className="h-7 text-xs">Megnéz</Button>
          </Link>
          {item.lead?.email && item.action !== "queued_outreach" && (
            <Button size="sm" variant="neon" onClick={queue} className="h-7 text-xs">
              <Send className="h-3 w-3 mr-1" /> Outreach
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function InboxItemCard({ item, onUpdate }: { item: any; onUpdate: (p: any) => void }) {
  const handle = async () => {
    await supabase.from("inbox_items").update({ status: "done" }).eq("id", item.item.id);
    onUpdate({ action: "done" });
    toast.success("Kész-nek jelölve");
  };
  return (
    <div className="p-3 rounded-lg border border-nf-border bg-nf-surface-alt/40">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] h-5">{item.item?.severity}</Badge>
            <span className="font-medium text-sm">{item.item?.title}</span>
          </div>
          <div className="text-[11px] text-nf-text-muted mt-0.5">{item.item?.kind}</div>
        </div>
        {item.action !== "done" ? (
          <Button size="sm" variant="outline" onClick={handle} className="h-7 text-xs">Kész</Button>
        ) : (
          <Badge className="bg-electric-300/20 text-electric-300 text-[10px] h-5">Kész</Badge>
        )}
      </div>
    </div>
  );
}

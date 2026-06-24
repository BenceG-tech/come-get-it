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
  content: "Content írás",
  doc_review: "Doksi review",
  decision: "Döntés-elemzés",
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
  if (item.kind === "content_draft") return <ContentDraftCard runId={runId} item={item} index={index} onUpdate={onUpdate} />;
  if (item.kind === "doc_review") return <DocReviewCard item={item} />;
  if (item.kind === "decision_analysis") return <DecisionCard item={item} onUpdate={onUpdate} />;
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

// ─────────────── Content draft card ───────────────

function ContentDraftCard({ runId, item, index, onUpdate }: { runId: string; item: any; index: number; onUpdate: (p: any) => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title ?? "");
  const [body, setBody] = useState(item.body ?? "");
  const [saving, setSaving] = useState(false);

  const updateAction = async (action: string, patch: any = {}) => {
    onUpdate({ action, ...patch });
    const { data } = await supabase.from("task_runs").select("result_items").eq("id", runId).maybeSingle();
    const arr: any[] = Array.isArray(data?.result_items) ? [...(data!.result_items as any[])] : [];
    arr[index] = { ...(arr[index] ?? {}), action, ...patch };
    await supabase.from("task_runs").update({ result_items: arr }).eq("id", runId);
  };

  const saveToStudio = async () => {
    setSaving(true);
    try {
      const formatKey = item.channel === "instagram" ? "ig_caption"
        : item.channel === "linkedin" ? "linkedin_post"
        : item.channel === "facebook" ? "fb_post"
        : item.channel === "email" ? "email_body"
        : "general";
      const formatLabel = item.channel === "instagram" ? "IG caption"
        : item.channel === "linkedin" ? "LinkedIn poszt"
        : item.channel === "facebook" ? "FB poszt"
        : item.channel === "email" ? "Email"
        : "Általános";
      const { error } = await supabase.from("saved_content_snippets").insert({
        format_key: formatKey,
        format_label: formatLabel,
        text: body,
        brief: item.topic ?? null,
        persona: item.persona ?? null,
        notes: title || null,
        tags: [item.length, item.channel].filter(Boolean),
      });
      if (error) throw error;
      toast.success("Mentve a Content Studio-ba");
      await updateAction("saved", { title, body });
      setEditing(false);
    } catch (e: any) {
      toast.error("Mentés hiba: " + (e?.message ?? e));
    }
    setSaving(false);
  };

  const copy = async () => {
    const text = title ? `${title}\n\n${body}` : body;
    await navigator.clipboard.writeText(text);
    toast.success("Vágólapra másolva");
    await updateAction("copied", { title, body });
  };

  const lengthBadge = item.length === "short" ? "Rövid" : item.length === "long" ? "Hosszú" : "Közepes";
  const isDone = item.action === "saved";

  return (
    <div className={`p-3 rounded-lg border bg-nf-surface-alt/40 ${isDone ? "opacity-60 border-electric-300/30" : "border-nf-border"}`}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <Badge variant="outline" className="text-[10px] h-5 capitalize">{item.channel}</Badge>
        <Badge variant="outline" className="text-[10px] h-5">{lengthBadge}</Badge>
        {item.action === "saved" && <Badge className="bg-electric-300/20 text-electric-300 text-[10px] h-5"><CheckCircle2 className="h-2.5 w-2.5 mr-1" />Mentve</Badge>}
        {item.action === "copied" && <Badge variant="outline" className="text-[10px] h-5">Másolva</Badge>}
      </div>

      {editing ? (
        <div className="space-y-2">
          {item.channel === "email" && <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tárgy" className="h-8 text-sm" />}
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={Math.min(14, Math.max(4, body.split("\n").length + 1))} className="text-sm" />
        </div>
      ) : (
        <div className="space-y-1">
          {title && <div className="text-sm font-medium">{title}</div>}
          <div className="text-xs text-nf-text-muted whitespace-pre-wrap">{body}</div>
        </div>
      )}

      <div className="flex gap-1.5 mt-2.5">
        <Button size="sm" variant="neon" onClick={saveToStudio} disabled={saving} className="h-7 text-xs">
          <Sparkles className="h-3 w-3 mr-1" /> {saving ? "Mentés…" : "Studio-ba"}
        </Button>
        <Button size="sm" variant="outline" onClick={copy} className="h-7 text-xs">Másol</Button>
        <Button size="sm" variant="outline" onClick={() => setEditing(!editing)} className="h-7 text-xs">
          <Edit3 className="h-3 w-3 mr-1" /> {editing ? "Mégse" : "Szerkeszt"}
        </Button>
      </div>
    </div>
  );
}

// ─────────────── Doc review card ───────────────

function DocReviewCard({ item }: { item: any }) {
  if (item.error) {
    return (
      <div className="p-3 rounded-lg border border-red-400/40 bg-red-500/5 text-sm">
        <div className="font-medium">{item.doc?.title ?? "Doksi"}</div>
        <div className="text-xs text-red-400 mt-1">{item.error}</div>
      </div>
    );
  }
  const r = item.review ?? {};
  const Section = ({ label, items, color }: { label: string; items?: string[]; color: string }) => (
    Array.isArray(items) && items.length ? (
      <div>
        <div className={`text-[11px] font-medium ${color} mb-1`}>{label}</div>
        <ul className="text-xs text-nf-text-muted space-y-0.5 list-disc list-inside">
          {items.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>
    ) : null
  );
  return (
    <div className="p-3 rounded-lg border border-nf-border bg-nf-surface-alt/40 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm truncate">{item.doc?.title}</div>
          <div className="text-[11px] text-nf-text-muted">{item.doc?.category}</div>
        </div>
        <Link to={`/admin/documents?id=${item.doc?.id}`} className="text-electric-300 hover:underline shrink-0">
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
      {r.summary && <div className="text-xs text-nf-text-muted italic border-l-2 border-electric-300/40 pl-2">{r.summary}</div>}
      <Section label="Erősségek" items={r.strengths} color="text-electric-300" />
      <Section label="Hiányosságok" items={r.gaps} color="text-amber-400" />
      <Section label="Javaslatok" items={r.suggestions} color="text-blue-400" />
    </div>
  );
}

// ─────────────── Decision card ───────────────

function DecisionCard({ item, onUpdate }: { item: any; onUpdate: (p: any) => void }) {
  const [logging, setLogging] = useState(false);
  if (item.error) {
    return (
      <div className="p-3 rounded-lg border border-red-400/40 bg-red-500/5 text-sm">
        <div className="font-medium">{item.decision_text ?? "Döntés"}</div>
        <div className="text-xs text-red-400 mt-1">{item.error}</div>
      </div>
    );
  }
  const a = item.analysis ?? {};
  const opts: any[] = Array.isArray(a.options) ? a.options : [];
  const confColor = a.confidence === "high" ? "text-electric-300" : a.confidence === "low" ? "text-amber-400" : "text-blue-400";

  const logDecision = async () => {
    setLogging(true);
    try {
      const text = a.recommendation
        ? `${item.decision_text} → ${a.recommendation}`
        : item.decision_text;
      const { error } = await supabase.from("decisions").insert({
        decision_text: text.slice(0, 500),
        expected_outcome: a.next_step?.slice(0, 500) ?? null,
        context: JSON.stringify({ options: opts, confidence: a.confidence }).slice(0, 2000),
      });
      if (error) throw error;
      toast.success("Naplózva a döntésnaplóba");
      onUpdate({ action: "logged" });
    } catch (e: any) {
      toast.error("Hiba: " + (e?.message ?? e));
    }
    setLogging(false);
  };

  return (
    <div className="p-3 rounded-lg border border-nf-border bg-nf-surface-alt/40 space-y-2.5">
      <div className="font-medium text-sm">{item.decision_text}</div>

      {opts.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-2">
          {opts.map((o, i) => (
            <div key={i} className="p-2 rounded border border-nf-border/60">
              <div className="text-xs font-medium mb-1">{o.label}</div>
              {Array.isArray(o.pros) && o.pros.length > 0 && (
                <div className="mb-1.5">
                  <div className="text-[10px] text-electric-300 mb-0.5">Pro</div>
                  <ul className="text-[11px] text-nf-text-muted space-y-0.5 list-disc list-inside">
                    {o.pros.map((s: string, j: number) => <li key={j}>{s}</li>)}
                  </ul>
                </div>
              )}
              {Array.isArray(o.cons) && o.cons.length > 0 && (
                <div>
                  <div className="text-[10px] text-amber-400 mb-0.5">Kontra</div>
                  <ul className="text-[11px] text-nf-text-muted space-y-0.5 list-disc list-inside">
                    {o.cons.map((s: string, j: number) => <li key={j}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {a.recommendation && (
        <div className="p-2 rounded bg-electric-300/5 border border-electric-300/30 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3 w-3 text-electric-300" />
            <span className="text-electric-300 font-medium">Ajánlás</span>
            {a.confidence && <span className={`text-[10px] ${confColor}`}>· {a.confidence}</span>}
          </div>
          <div className="text-nf-text-muted">{a.recommendation}</div>
          {a.next_step && <div className="text-nf-text-muted mt-1">→ {a.next_step}</div>}
        </div>
      )}

      <div className="flex gap-1.5">
        {item.action !== "logged" ? (
          <Button size="sm" variant="neon" onClick={logDecision} disabled={logging} className="h-7 text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" /> {logging ? "Mentés…" : "Naplózom"}
          </Button>
        ) : (
          <Badge className="bg-electric-300/20 text-electric-300 text-[10px] h-5">Naplózva</Badge>
        )}
        {item.decision_id && (
          <Link to={`/admin/decisions`}>
            <Button size="sm" variant="outline" className="h-7 text-xs">Megnyit</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

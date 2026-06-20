import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Check, X, RotateCw, StopCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  docs: any[];
  onDone: () => void;
}

type Status = "pending" | "running" | "done" | "error";

interface RowState {
  id: string;
  title: string;
  status: Status;
  preview: string;
  error?: string;
}

export default function BatchProcessDialog({ open, onClose, docs, onDone }: Props) {
  const { toast } = useToast();
  const [rows, setRows] = useState<RowState[]>(
    docs.map((d) => ({ id: d.id, title: d.title, status: "pending" as Status, preview: "" }))
  );
  const [running, setRunning] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const abortRef = useRef<AbortController | null>(null);

  const update = (i: number, patch: Partial<RowState>) =>
    setRows((r) => r.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  const runOne = async (i: number) => {
    update(i, { status: "running", preview: "", error: undefined });
    setCurrentIdx(i);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/summarize-document`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ docId: rows[i].id }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        update(i, { preview: acc.slice(-400) });
      }
      update(i, { status: "done", preview: acc.slice(-200) });
    } catch (e: any) {
      if (e?.name === "AbortError") {
        update(i, { status: "error", error: "Megszakítva" });
        throw e;
      }
      update(i, { status: "error", error: e?.message ?? String(e) });
    }
  };

  const runAll = async () => {
    setRunning(true);
    try {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].status === "done") continue;
        try {
          await runOne(i);
        } catch (e: any) {
          if (e?.name === "AbortError") break;
        }
      }
      toast({ title: "Kész", description: "Batch feldolgozás befejezve." });
      onDone();
    } finally {
      setRunning(false);
      setCurrentIdx(-1);
      abortRef.current = null;
    }
  };

  const stop = () => abortRef.current?.abort();

  const retry = async (i: number) => {
    setRunning(true);
    try { await runOne(i); onDone(); } catch {}
    setRunning(false);
    setCurrentIdx(-1);
  };

  const doneCount = rows.filter((r) => r.status === "done").length;
  const errCount = rows.filter((r) => r.status === "error").length;
  const pct = rows.length ? Math.round((doneCount / rows.length) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !running && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-electric-300" />
            AI batch feldolgozás
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-nf-text-muted">{doneCount} / {rows.length} kész{errCount > 0 ? ` · ${errCount} hiba` : ""}</span>
            <span className="text-electric-300 font-medium">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-nf-surface overflow-hidden">
            <div className="h-full bg-electric-300 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 -mr-1">
          {rows.map((r, i) => (
            <div key={r.id} className={cn(
              "p-3 rounded-lg border text-sm",
              r.status === "running" && "border-electric-300/50 bg-electric-300/5",
              r.status === "done" && "border-emerald-500/30 bg-emerald-500/5",
              r.status === "error" && "border-red-500/30 bg-red-500/5",
              r.status === "pending" && "border-nf-border bg-nf-surface-alt/30",
            )}>
              <div className="flex items-center gap-2">
                <div className="shrink-0">
                  {r.status === "pending" && <div className="h-4 w-4 rounded-full border-2 border-nf-border" />}
                  {r.status === "running" && <Loader2 className="h-4 w-4 text-electric-300 animate-spin" />}
                  {r.status === "done" && <Check className="h-4 w-4 text-emerald-400" />}
                  {r.status === "error" && <X className="h-4 w-4 text-red-400" />}
                </div>
                <div className="font-medium truncate flex-1">{r.title}</div>
                {r.status === "error" && (
                  <button onClick={() => retry(i)} disabled={running} className="text-xs text-electric-300 hover:underline flex items-center gap-1">
                    <RotateCw className="h-3 w-3" /> Újra
                  </button>
                )}
              </div>
              {r.status === "running" && r.preview && (
                <pre className="mt-2 text-[10px] text-white/50 bg-black/30 rounded p-2 max-h-24 overflow-auto font-mono whitespace-pre-wrap">
                  {r.preview}<span className="animate-pulse">▍</span>
                </pre>
              )}
              {r.status === "error" && r.error && (
                <p className="mt-1 text-xs text-red-400">{r.error}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-nf-border">
          {running ? (
            <Button variant="outline" onClick={stop}>
              <StopCircle className="h-4 w-4" /> Megszakít
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>Bezár</Button>
              <Button variant="neon" onClick={runAll} disabled={rows.every((r) => r.status === "done")}>
                <Sparkles className="h-4 w-4" /> {doneCount > 0 ? "Folytatás" : "Indítás"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

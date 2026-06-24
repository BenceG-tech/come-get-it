import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

const BATCH = 10;

export default function BulkReviewDialog({ open, onOpenChange }: Props) {
  const [pending, setPending] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const [failed, setFailed] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [finished, setFinished] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; error: string }[]>([]);

  useEffect(() => {
    if (!open) return;
    setDone(0); setFailed(0); setSkipped(0); setFinished(false); setErrors([]);
    (async () => {
      // Count docs that have text and no ai_review
      const { count } = await supabase
        .from("documents")
        .select("id", { count: "exact", head: true })
        .is("ai_review", null)
        .or("content.not.is.null,description.not.is.null");
      setPending(count ?? 0);
    })();
  }, [open]);

  const start = async () => {
    if (!pending) return;
    setRunning(true);
    let remaining = pending;
    let safety = 20; // max 200 doksi egy futás
    while (remaining > 0 && safety-- > 0) {
      try {
        const { data, error } = await supabase.functions.invoke("auto-review-documents", { body: { limit: BATCH } });
        if (error) throw error;
        const d = data as any;
        setDone((x) => x + (d.succeeded ?? 0));
        setFailed((x) => x + (d.failed ?? 0));
        setSkipped((x) => x + (d.skipped_no_text ?? 0));
        if (d.errors?.length) setErrors((cur) => [...cur, ...d.errors.slice(0, 5)]);
        const advanced = (d.succeeded ?? 0) + (d.failed ?? 0);
        if (advanced === 0) break;
        remaining -= advanced;
      } catch (e: any) {
        toast.error("Hiba: " + (e?.message ?? e));
        break;
      }
    }
    setRunning(false);
    setFinished(true);
  };

  const total = pending ?? 0;
  const progressed = done + failed;
  const pct = total ? Math.min(100, Math.round((progressed / total) * 100)) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-electric-300/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-electric-300" /> AI review az összes doksira
          </DialogTitle>
          <DialogDescription>
            Az AI átnézi a doksikat 4 szempont szerint (tartalom, brand, jog, marketing) és pontoz. Csak a szöveges tartalmú, még nem review-olt doksikat dolgozza fel.
          </DialogDescription>
        </DialogHeader>

        {pending === null && (
          <div className="text-sm text-nf-text-muted flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> Számolás…</div>
        )}

        {pending !== null && !running && !finished && (
          <div className="space-y-3">
            <div className="text-sm">
              {pending === 0 ? (
                <span className="text-nf-text-muted">Minden doksi review-olva van. 🎉</span>
              ) : (
                <><span className="font-medium">{pending}</span> doksi vár review-ra.</>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Bezárás</Button>
              {pending > 0 && (
                <Button variant="neon" onClick={start}>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Indítsd el
                </Button>
              )}
            </div>
          </div>
        )}

        {(running || finished) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-nf-text-muted">
              <span className="flex items-center gap-1.5">
                {running ? <Loader2 className="h-3 w-3 animate-spin text-electric-300" /> : <CheckCircle2 className="h-3 w-3 text-electric-300" />}
                {running ? "Review folyamatban…" : "Kész"}
              </span>
              <span>{progressed}/{total}</span>
            </div>
            <Progress value={pct} className="h-1.5" />
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded border border-electric-300/30 bg-electric-300/5">
                <div className="text-[10px] text-nf-text-muted">Kész</div>
                <div className="font-semibold text-electric-300">{done}</div>
              </div>
              <div className="p-2 rounded border border-red-400/30 bg-red-500/5">
                <div className="text-[10px] text-nf-text-muted">Hiba</div>
                <div className="font-semibold text-red-400">{failed}</div>
              </div>
              <div className="p-2 rounded border border-nf-border">
                <div className="text-[10px] text-nf-text-muted">Kihagyva</div>
                <div className="font-semibold">{skipped}</div>
              </div>
            </div>
            {errors.length > 0 && (
              <div className="text-[11px] space-y-1 max-h-32 overflow-y-auto">
                {errors.slice(0, 8).map((e, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-nf-text-muted">
                    <AlertCircle className="h-3 w-3 text-red-400 mt-0.5 shrink-0" />
                    <span><span className="text-white">{e.title ?? "?"}</span> — {e.error}</span>
                  </div>
                ))}
              </div>
            )}
            {finished && (
              <div className="flex justify-end pt-1">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Bezárás</Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

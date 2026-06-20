import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, AlertTriangle, MessageSquare, Scale, Megaphone } from "lucide-react";

type Section = {
  score: number;
  summary: string;
  issues: { location: string; problem: string; fix: string }[];
};
type Review = {
  overall: string;
  top_actions: string[];
  content_accuracy: Section;
  brand_tone: Section;
  legal_risk: Section;
  marketing_power: Section;
};

const SECTIONS: { key: keyof Review; label: string; icon: any }[] = [
  { key: "content_accuracy", label: "Tartalmi pontosság", icon: AlertTriangle },
  { key: "brand_tone", label: "Brand & hangnem", icon: MessageSquare },
  { key: "legal_risk", label: "Jogi / üzleti kockázat", icon: Scale },
  { key: "marketing_power", label: "Marketing erő", icon: Megaphone },
];

export const DocumentReviewDialog = ({ open, onOpenChange, docId, existingReview }: { open: boolean; onOpenChange: (v: boolean) => void; docId: string; existingReview?: any }) => {
  const { toast } = useToast();
  const [raw, setRaw] = useState("");
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState<Review | null>(existingReview ?? null);

  useEffect(() => {
    if (open && existingReview) setReview(existingReview);
  }, [open, existingReview]);

  useEffect(() => {
    // Try parse as it streams
    if (!raw) return;
    try { setReview(JSON.parse(raw)); } catch { /* not complete yet */ }
  }, [raw]);

  const run = async () => {
    setBusy(true); setRaw(""); setReview(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/review-document`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ docId }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setRaw(acc);
      }
    } catch (e: any) {
      toast({ title: "Hiba", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const scoreColor = (s: number) => s >= 8 ? "text-emerald-400" : s >= 5 ? "text-amber-400" : "text-rose-400";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-electric-300" /> AI doksi review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button onClick={run} disabled={busy} variant="neon" className="w-full">
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Reviewolás folyamatban…</> : <><Sparkles className="h-4 w-4" /> {review ? "Újra review" : "Indítsd el a review-t"}</>}
          </Button>

          {busy && !review && raw && (
            <div className="text-xs text-nf-text-muted bg-nf-surface p-3 rounded border border-nf-border max-h-40 overflow-auto">
              <div className="mb-1 text-electric-300">AI dolgozik…</div>
              <pre className="whitespace-pre-wrap">{raw.slice(-800)}</pre>
            </div>
          )}

          {review && (
            <div className="space-y-4">
              {review.overall && (
                <div className="p-3 rounded-lg bg-electric-300/10 border border-electric-300/30">
                  <div className="text-[10px] uppercase tracking-wider text-electric-300 mb-1">Összegzés</div>
                  <div className="text-sm">{review.overall}</div>
                </div>
              )}
              {review.top_actions?.length > 0 && (
                <div>
                  <div className="text-xs font-bold mb-2">Legfontosabb teendők</div>
                  <ol className="space-y-1 text-sm list-decimal pl-5">
                    {review.top_actions.map((a, i) => <li key={i}>{a}</li>)}
                  </ol>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-3">
                {SECTIONS.map(({ key, label, icon: Icon }) => {
                  const s = (review[key] as Section) || null;
                  if (!s) return null;
                  return (
                    <div key={key} className="border border-nf-border rounded-lg p-3 bg-nf-surface space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold"><Icon className="h-3.5 w-3.5" /> {label}</div>
                        <div className={`text-2xl font-bold ${scoreColor(s.score)}`}>{s.score}<span className="text-xs text-nf-text-muted">/10</span></div>
                      </div>
                      {s.summary && <p className="text-xs text-nf-text-muted">{s.summary}</p>}
                      {s.issues?.length > 0 && (
                        <ul className="space-y-2 text-xs">
                          {s.issues.map((i, idx) => (
                            <li key={idx} className="border-l-2 border-electric-300/40 pl-2">
                              <div className="font-medium">{i.location}</div>
                              <div className="text-rose-300/90">⚠ {i.problem}</div>
                              <div className="text-emerald-300/90">→ {i.fix}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentReviewDialog;

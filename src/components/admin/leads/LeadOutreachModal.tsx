import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Send, RefreshCw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Tone = "founding_pitch" | "warm_intro" | "short_nudge";
type Draft = { tone: Tone; subject: string; body: string };

const TONE_LABEL: Record<Tone, string> = {
  founding_pitch: "Founding pitch",
  warm_intro: "Warm intro",
  short_nudge: "Rövid nudge",
};

export default function LeadOutreachModal({
  partnerId, partnerName, open, onOpenChange, onDone,
}: {
  partnerId: string | null;
  partnerName?: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDone?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [activeTone, setActiveTone] = useState<Tone>("founding_pitch");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [partner, setPartner] = useState<any>(null);
  const [recentDays, setRecentDays] = useState<number | null>(null);
  const { toast } = useToast();

  // Reset + load on open
  useEffect(() => {
    if (!open || !partnerId) return;
    setDrafts([]); setSubject(""); setBody(""); setActiveTone("founding_pitch"); setRecentDays(null);

    (async () => {
      const [{ data: p }, { data: ev }] = await Promise.all([
        supabase.from("partners").select("company_name, contact_name, city, category, email").eq("id", partnerId).maybeSingle(),
        supabase.from("outreach_events")
          .select("sent_at, outreach_enrollments!inner(entity_id)")
          .eq("outreach_enrollments.entity_id", partnerId)
          .order("sent_at", { ascending: false }).limit(1),
      ]);
      setPartner(p ?? null);
      const last = (ev ?? [])[0]?.sent_at;
      if (last) {
        const days = Math.floor((Date.now() - new Date(last).getTime()) / 86400000);
        if (days <= 30) setRecentDays(days);
      }
      generate();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, partnerId]);

  const generate = async () => {
    if (!partnerId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("outreach-quick-drafts", {
        body: { partner_id: partnerId },
      });
      if (error) throw error;
      const list: Draft[] = Array.isArray(data?.drafts) ? data.drafts : [];
      if (list.length === 0) throw new Error("Nem érkezett draft.");
      setDrafts(list);
      const first = list.find((d) => d.tone === activeTone) ?? list[0];
      setActiveTone(first.tone);
      setSubject(first.subject);
      setBody(first.body);
    } catch (e: any) {
      toast({ title: "AI hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const pickTone = (t: Tone) => {
    setActiveTone(t);
    const d = drafts.find((x) => x.tone === t);
    if (d) { setSubject(d.subject); setBody(d.body); }
  };

  const previewVars = {
    company_name: partner?.company_name ?? partnerName ?? "",
    contact_name: partner?.contact_name ?? "",
    first_name: (partner?.contact_name ?? "").split(" ")[0] ?? "",
    city: partner?.city ?? "",
  };
  const render = (s: string) =>
    s.replace(/\{\{(\w+)\}\}/g, (_, k) => (previewVars as any)[k] ?? `{{${k}}}`);

  const send = async () => {
    if (!partnerId || !subject.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      // Find or fall back to lead_quick sequence
      const { data: seqs } = await supabase
        .from("outreach_sequences")
        .select("id")
        .eq("name", "Lead quick outreach")
        .eq("active", true)
        .limit(1);
      const sequenceId = seqs?.[0]?.id;
      if (!sequenceId) throw new Error("'Lead quick outreach' sequence hiányzik.");

      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase.from("outreach_enrollments").insert({
        sequence_id: sequenceId,
        entity_type: "partner",
        entity_id: partnerId,
        status: "active",
        current_step: 0,
        next_run_at: new Date().toISOString(),
        created_by: auth.user?.id ?? null,
        metadata: {
          personalized_steps: [{ subject: subject.trim(), body: body.trim() }],
          tone: activeTone,
          quick: true,
        } as any,
      } as any);
      if (error) throw error;
      toast({ title: "Outreach indítva", description: `${partnerName ?? "Partner"} — küldés a következő futáskor.` });
      onDone?.();
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-electric-300" />
            Outreach: {partnerName ?? "partner"}
          </DialogTitle>
        </DialogHeader>

        {/* Tone chips */}
        <div className="flex flex-wrap items-center gap-2">
          {(["founding_pitch", "warm_intro", "short_nudge"] as Tone[]).map((t) => {
            const has = drafts.some((d) => d.tone === t);
            const active = activeTone === t;
            return (
              <button
                key={t}
                onClick={() => has && pickTone(t)}
                disabled={!has || loading}
                className={`px-3 py-1.5 text-xs rounded-full border transition ${
                  active
                    ? "bg-electric-300 text-black border-electric-300"
                    : "border-nf-border text-nf-text-muted hover:text-white disabled:opacity-40"
                }`}
              >
                {TONE_LABEL[t]}{active ? " ✓" : ""}
              </button>
            );
          })}
          <Button
            size="sm" variant="ghost" onClick={generate} disabled={loading || !partnerId}
            className="ml-auto h-8"
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
            Újra generál
          </Button>
        </div>

        {loading && drafts.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-sm text-nf-text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-electric-300" />
            AI 3 sablont készít…
          </div>
        ) : (
          <div className="space-y-3 mt-1">
            <div>
              <Label className="text-xs">Tárgy <span className="text-nf-text-muted">({subject.length} char)</span></Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email tárgy" />
            </div>
            <div>
              <Label className="text-xs">Szöveg</Label>
              <Textarea
                rows={10}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="resize-y text-sm"
                placeholder="Email szövege…"
              />
              <p className="text-[10px] text-nf-text-muted mt-1">
                Élesben: <span className="text-electric-300">{render(subject).slice(0, 60)}</span> — {render(body).slice(0, 90)}…
              </p>
            </div>

            {recentDays !== null && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/5 border border-amber-500/30 rounded-md px-2 py-1.5">
                <AlertTriangle className="h-3 w-3" />
                {recentDays} napja már ment levél ennek a partnernek.
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-nf-border mt-2">
          <div className="text-[11px] text-nf-text-muted">
            {partner?.email ? <>Címzett: <span className="text-white">{partner.email}</span></> : "Címzett nincs megadva — a sequence email-csatornán megy."}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Mégse</Button>
            <Button
              size="sm" onClick={send}
              disabled={submitting || loading || !subject.trim() || !body.trim()}
              className={recentDays !== null ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
            >
              {submitting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Send className="h-3 w-3 mr-1" />}
              Küldés most
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

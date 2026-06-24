import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Send, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FieldHelp from "@/components/admin/help/FieldHelp";
import EmailPreviewCard from "./EmailPreviewCard";

type Tone = "founding_pitch" | "warm_intro" | "short_nudge" | "meeting_close";
type Len = "short" | "medium" | "long";

const TONE_OPTIONS: { v: Tone; l: string; help: string }[] = [
  { v: "founding_pitch", l: "Founding pitch", help: "Limitált founding kör + 2-3 konkrét perk. Magabiztos, nem nyomulós." },
  { v: "warm_intro", l: "Warm intro", help: "Személyes bemutatkozás, 1 konkrét részlet a partnerről, kávé-CTA." },
  { v: "short_nudge", l: "Rövid nudge", help: "Max 60 szó follow-up emlékeztető, 1 kérdés a végén." },
  { v: "meeting_close", l: "Meeting close", help: "Feltételezzük az érdeklődést, 2 időpont + helyszín ajánlás." },
];

const LEN_LABELS: Record<Len, string> = { short: "Rövid (~60)", medium: "Közepes (~120)", long: "Hosszú (~200)" };

type StepOverride = { subject?: string; preheader?: string; body?: string };

export default function LeadOutreachModal({
  partnerId, partnerName, open, onOpenChange, onDone,
}: {
  partnerId: string | null;
  partnerName?: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDone?: () => void;
}) {
  const [sequences, setSequences] = useState<any[]>([]);
  const [sequenceId, setSequenceId] = useState<string>("");
  const [stepIndex, setStepIndex] = useState(0);
  const [tone, setTone] = useState<Tone>("founding_pitch");
  const [length, setLength] = useState<Len>("medium");
  const [extra, setExtra] = useState("");

  // Per-step overrides
  const [overrides, setOverrides] = useState<Record<number, StepOverride>>({});

  // AI extras
  const [variants, setVariants] = useState<string[]>([]);
  const [risks, setRisks] = useState<string[]>([]);

  // Settings tab
  const [startMode, setStartMode] = useState<"now" | "tomorrow9" | "custom">("now");
  const [customStart, setCustomStart] = useState<string>("");
  const [recentGuard, setRecentGuard] = useState(true);
  const [attachFoundingPdf, setAttachFoundingPdf] = useState(false);

  // Partner contact data for preview placeholders
  const [partner, setPartner] = useState<any>(null);

  const [personalizing, setPersonalizing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const seq = sequences.find((s) => s.id === sequenceId);
  const steps: any[] = Array.isArray(seq?.steps) ? seq.steps : [];
  const baseStep = steps[stepIndex] ?? {};
  const current: StepOverride = overrides[stepIndex] ?? {};
  const subject = current.subject ?? baseStep.subject ?? "";
  const preheader = current.preheader ?? "";
  const body = current.body ?? baseStep.body ?? "";

  const setField = (patch: StepOverride) =>
    setOverrides((o) => ({ ...o, [stepIndex]: { ...o[stepIndex], ...patch } }));

  useEffect(() => {
    if (!open) return;
    setOverrides({}); setVariants([]); setRisks([]); setStepIndex(0); setExtra("");
    (async () => {
      const [{ data: seqs }, { data: p }] = await Promise.all([
        supabase.from("outreach_sequences").select("id, name, kind, steps").eq("active", true).order("name"),
        partnerId
          ? supabase.from("partners").select("company_name, contact_name, city, category").eq("id", partnerId).maybeSingle()
          : Promise.resolve({ data: null } as any),
      ]);
      setSequences(seqs ?? []);
      if (seqs && seqs[0]) setSequenceId(seqs[0].id);
      setPartner(p ?? null);
    })();
  }, [open, partnerId]);

  const personalize = async () => {
    if (!partnerId || !sequenceId) return;
    setPersonalizing(true);
    try {
      const { data, error } = await supabase.functions.invoke("outreach-personalize", {
        body: {
          partner_id: partnerId, sequence_id: sequenceId, step_index: stepIndex,
          tone, length, extra_instructions: extra || undefined,
          base_subject: current.subject || undefined,
          base_body: current.body || undefined,
        },
      });
      if (error) throw error;
      setField({ subject: data?.subject ?? "", preheader: data?.preheader ?? "", body: data?.body ?? "" });
      setVariants(Array.isArray(data?.variants) ? data.variants : []);
      setRisks(Array.isArray(data?.risks) ? data.risks : []);
    } catch (e: any) {
      toast({ title: "AI hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally { setPersonalizing(false); }
  };

  const nextRunIso = useMemo(() => {
    if (startMode === "now") return new Date().toISOString();
    if (startMode === "tomorrow9") {
      const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); return d.toISOString();
    }
    if (customStart) return new Date(customStart).toISOString();
    return new Date().toISOString();
  }, [startMode, customStart]);

  const enroll = async () => {
    if (!partnerId || !sequenceId) return;
    setSubmitting(true);
    try {
      if (recentGuard) {
        const since = new Date(Date.now() - 30 * 86400000).toISOString();
        const { count } = await supabase.from("outreach_events")
          .select("id, enrollment_id, sent_at, outreach_enrollments!inner(entity_id)", { count: "exact", head: true })
          .gte("sent_at", since)
          .eq("outreach_enrollments.entity_id", partnerId);
        if ((count ?? 0) > 0) {
          if (!confirm("Az elmúlt 30 napban már ment levél ennek a partnernek. Tényleg indítsam?")) {
            setSubmitting(false); return;
          }
        }
      }

      // build personalized_steps array
      const maxIdx = Math.max(0, ...Object.keys(overrides).map((k) => Number(k)));
      const personalized_steps: any[] = [];
      for (let i = 0; i <= maxIdx; i++) personalized_steps[i] = overrides[i] ?? null;

      let finalBody = body;
      if (attachFoundingPdf) {
        finalBody = `${finalBody}\n\n📎 Founding Partner pitch: https://come-get-it.app/founding-pitch.pdf`;
        personalized_steps[stepIndex] = { ...(personalized_steps[stepIndex] ?? {}), body: finalBody };
      }

      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase.from("outreach_enrollments").insert({
        sequence_id: sequenceId,
        entity_type: "partner",
        entity_id: partnerId,
        status: "active",
        current_step: 0,
        next_run_at: nextRunIso,
        created_by: auth.user?.id ?? null,
        metadata: {
          personalized_steps,
          tone, length,
          attach_founding_pdf: attachFoundingPdf,
        } as any,
      } as any);
      if (error) throw error;
      toast({ title: "Outreach indítva", description: `${partnerName ?? "Partner"} beléptetve.` });
      onDone?.();
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  const previewVars = {
    company_name: partner?.company_name ?? partnerName ?? "",
    contact_name: partner?.contact_name ?? "",
    first_name: (partner?.contact_name ?? "").split(" ")[0] ?? "",
    city: partner?.city ?? "",
    category: partner?.category ?? "",
  };

  const wordCount = (body ?? "").trim().split(/\s+/).filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>📨 Outreach indítása — {partnerName ?? "partner"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs flex items-center gap-1">
                Sequence <FieldHelp text="Melyik előre megírt levélfolyam fut le. Founding pitch = ajánlott most." />
              </Label>
              {sequences.length === 0 ? (
                <p className="text-sm text-nf-text-muted">Nincs aktív sequence — hozz létre egyet az Outreach oldalon.</p>
              ) : (
                <select value={sequenceId} onChange={(e) => { setSequenceId(e.target.value); setStepIndex(0); setOverrides({}); }}
                  className="w-full rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm">
                  {sequences.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.kind})</option>)}
                </select>
              )}
            </div>
            <div>
              <Label className="text-xs flex items-center gap-1">
                Melyik lépés <FieldHelp text="Egyszerre egy lépést szerkesztesz. Az indítás mindig a 0. lépéssel kezdődik, de minden lépésre tehetsz override-ot." />
              </Label>
              <select value={stepIndex} onChange={(e) => setStepIndex(Number(e.target.value))}
                className="w-full rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm">
                {steps.map((s, i) => (
                  <option key={i} value={i}>#{i + 1} — {s.channel ?? "email"} {s.subject ? `· ${s.subject.slice(0, 40)}` : ""}</option>
                ))}
                {steps.length === 0 && <option value={0}>Nincs lépés</option>}
              </select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="content" className="mt-3">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="content">Tartalom</TabsTrigger>
            <TabsTrigger value="preview">Előnézet</TabsTrigger>
            <TabsTrigger value="settings">Beállítások</TabsTrigger>
          </TabsList>

          {/* TARTALOM */}
          <TabsContent value="content" className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Label className="text-xs flex items-center gap-1 mr-1">
                Hangnem <FieldHelp text="Az AI ehhez igazítja a stílust és a hosszt." />
              </Label>
              {TONE_OPTIONS.map((t) => (
                <button key={t.v} onClick={() => setTone(t.v)}
                  title={t.help}
                  className={`px-2.5 py-1 text-xs rounded-full border ${tone === t.v ? "bg-electric-300 text-black border-electric-300" : "border-nf-border text-nf-text-muted hover:text-white"}`}>
                  {t.l}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
              <div>
                <Label className="text-xs flex items-center gap-1">
                  Hossz: {LEN_LABELS[length]}
                  <FieldHelp text="Kb. ennyi szóra céloz az AI a body-ban." />
                </Label>
                <Slider
                  value={[length === "short" ? 0 : length === "medium" ? 1 : 2]}
                  min={0} max={2} step={1}
                  onValueChange={(v) => setLength(v[0] === 0 ? "short" : v[0] === 1 ? "medium" : "long")}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={personalize} disabled={!sequenceId || personalizing}>
                  {personalizing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                  AI személyre szabás
                </Button>
                <Button size="sm" variant="ghost" onClick={personalize} disabled={!sequenceId || personalizing} title="Újra generál más subject-variánsokkal">
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs flex items-center gap-1">
                Kiegészítő instrukció (opcionális) <FieldHelp text="Pl. 'hivatkozz a tegnapi IG posztra', 'kerüld a humort'. Az AI ezt is figyelembe veszi." />
              </Label>
              <Input value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="pl. emeld ki, hogy közös ismerős a..." />
            </div>

            <div>
              <Label className="text-xs flex items-center gap-1">
                Subject <FieldHelp text="A postafiók tárgy mezője. 40–60 karakter közt a legjobb." />
                <span className="ml-auto text-[10px] text-nf-text-muted">{subject.length} char</span>
              </Label>
              <Input value={subject} onChange={(e) => setField({ subject: e.target.value })} placeholder="AI generálás után tölt..." />
              {variants.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-[10px] text-nf-text-muted self-center mr-1">Alternatívák:</span>
                  {variants.map((v, i) => (
                    <Badge key={i} variant="outline" className="cursor-pointer text-[10px]" onClick={() => setField({ subject: v })}>
                      {v}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="text-xs flex items-center gap-1">
                Preheader <FieldHelp text="A subject után megjelenő szürke szöveg a postafiókban. Max ~90 char." />
              </Label>
              <Input value={preheader} onChange={(e) => setField({ preheader: e.target.value })} placeholder="Preview text..." />
            </div>

            <div>
              <Label className="text-xs flex items-center gap-1">
                Body <FieldHelp text="A levél törzse. {{first_name}}, {{company_name}}, {{city}} placeholder-ek behelyettesítve mennek ki." />
                <span className="ml-auto text-[10px] text-nf-text-muted">{wordCount} szó</span>
              </Label>
              <Textarea rows={12} value={body} onChange={(e) => setField({ body: e.target.value })}
                className="resize-y font-mono text-sm" placeholder="AI személyre szabás után megjelenik..." />
              <p className="text-[10px] text-nf-text-muted mt-1">Ha üres marad, a sequence eredeti lépése megy ki.</p>
            </div>

            {risks.length > 0 && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 mb-1">
                  <AlertTriangle className="h-3 w-3" /> AI figyelmeztetések a follow-up-hoz
                </div>
                <ul className="text-xs text-amber-200/90 list-disc pl-4 space-y-0.5">
                  {risks.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}

            {Object.keys(overrides).length > 0 && (
              <div className="text-[10px] text-electric-300">
                Override-ok: {Object.keys(overrides).map((k) => `#${Number(k) + 1}`).join(", ")}
              </div>
            )}
          </TabsContent>

          {/* PREVIEW */}
          <TabsContent value="preview">
            <EmailPreviewCard subject={subject} preheader={preheader} body={body} vars={previewVars} />
            <p className="text-[10px] text-nf-text-muted mt-2">
              Placeholder behelyettesítés a partner adatai alapján. A tényleges küldés ugyanezt fogja látni.
            </p>
          </TabsContent>

          {/* SETTINGS */}
          <TabsContent value="settings" className="space-y-4">
            <div>
              <Label className="text-xs flex items-center gap-1">
                Mikor induljon <FieldHelp text="Az első lépés ekkor kerül a futási sorba. Az outreach-tick cron óránként pörget." />
              </Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {[
                  { v: "now", l: "Most" },
                  { v: "tomorrow9", l: "Holnap 9:00" },
                  { v: "custom", l: "Egyedi időpont" },
                ].map((o) => (
                  <button key={o.v} onClick={() => setStartMode(o.v as any)}
                    className={`px-2.5 py-1 text-xs rounded-full border ${startMode === o.v ? "bg-electric-300 text-black border-electric-300" : "border-nf-border text-nf-text-muted hover:text-white"}`}>
                    {o.l}
                  </button>
                ))}
              </div>
              {startMode === "custom" && (
                <Input type="datetime-local" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="mt-2 max-w-xs" />
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-nf-border p-3">
              <div>
                <div className="text-sm flex items-center gap-1">
                  30 napos guard <FieldHelp text="Ha az elmúlt 30 napban már küldtünk levelet ennek a partnernek, megerősítést kér." />
                </div>
                <div className="text-xs text-nf-text-muted">Védelem a dupla outreach ellen.</div>
              </div>
              <Switch checked={recentGuard} onCheckedChange={setRecentGuard} />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-nf-border p-3">
              <div>
                <div className="text-sm flex items-center gap-1">
                  Founding pitch PDF csatolása <FieldHelp text="A body végére link kerül a Founding Partner PDF-re." />
                </div>
                <div className="text-xs text-nf-text-muted">come-get-it.app/founding-pitch.pdf</div>
              </div>
              <Switch checked={attachFoundingPdf} onCheckedChange={setAttachFoundingPdf} />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Mégse</Button>
          <Button variant="neon" onClick={enroll} disabled={submitting || !sequenceId}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />} Indítás
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

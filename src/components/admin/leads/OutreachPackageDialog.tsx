import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Package, Copy, Download, RefreshCw, Sparkles, Mail, Save, Video, Image as ImageIcon, CheckCircle2, AlertTriangle, Upload, Circle } from "lucide-react";
import EmailComposer from "@/components/admin/leads/EmailComposer";
import { getLeadProfile, type LeadRow } from "@/lib/lead-profile";
import {
  aiExtraInstruction, buildCsomag, buildTexts, readSavedCsomag,
  type Offer, type OutreachCsomag, type OutreachTexts,
} from "@/lib/outreach-csomag";
import { saveCsomag, uploadCsomagMedia } from "@/lib/outreach-csomag-store";
import {
  downloadBlob, loadImage, playVideoPreview, posterDataFrom, recordVideo, renderPosterBlob, slugify,
  POSTER_SIZE, type PosterVariant,
} from "@/lib/outreach-media";

type StepState = "idle" | "busy" | "done" | "error";
type Steps = { texts: StepState; feed: StepState; story: StepState; video: StepState };
const IDLE: Steps = { texts: "idle", feed: "idle", story: "idle", video: "idle" };

const TEXT_FIELDS: { key: keyof OutreachTexts; label: string; rows: number }[] = [
  { key: "emailSubject", label: "E-mail – tárgy", rows: 1 },
  { key: "emailBody", label: "E-mail – szöveg", rows: 14 },
  { key: "dm", label: "Instagram-DM", rows: 6 },
  { key: "followup", label: "Utánkövető üzenet (3 nap múlva)", rows: 7 },
  { key: "opener", label: "Személyes nyitómondat a pulthoz", rows: 4 },
  { key: "postInstagram", label: "Bejelentő poszt – Instagram / Facebook", rows: 9 },
  { key: "postTiktok", label: "Bejelentő poszt – TikTok", rows: 6 },
];

function StepIcon({ s }: { s: StepState }) {
  if (s === "busy") return <Loader2 className="w-3.5 h-3.5 animate-spin text-electric-300" />;
  if (s === "done") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
  if (s === "error") return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
  return <Circle className="w-3.5 h-3.5 text-nf-text-muted/50" />;
}

const errMsg = (e: unknown) => (e instanceof Error ? e.message : typeof e === "object" && e && "message" in e ? String((e as { message: unknown }).message) : String(e));

export default function OutreachPackageDialog({
  partnerId, open, onOpenChange, onSaved,
}: {
  partnerId: string | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSaved?: () => void;
}) {
  const [partner, setPartner] = useState<LeadRow | null>(null);
  const [csomag, setCsomag] = useState<OutreachCsomag | null>(null);
  const [dirty, setDirty] = useState(false);
  const [steps, setSteps] = useState<Steps>(IDLE);
  const [running, setRunning] = useState(false);
  const [includeVideo, setIncludeVideo] = useState(true);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [photoNote, setPhotoNote] = useState<string | null>(null);
  const [posterUrls, setPosterUrls] = useState<Partial<Record<PosterVariant, string>>>({});
  const [videoLocal, setVideoLocal] = useState<{ url: string; blob: Blob; ext: string } | null>(null);
  const [recProgress, setRecProgress] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [emailOpen, setEmailOpen] = useState<null | { subject: string; body: string }>(null);
  const [tab, setTab] = useState("offer");
  const cancelled = useRef(false);
  const { toast } = useToast();

  const profile = useMemo(() => (partner ? getLeadProfile(partner) : null), [partner]);
  const posterData = useMemo(() => (profile && csomag ? posterDataFrom(profile, csomag, photo) : null), [profile, csomag, photo]);
  const fileBase = slugify(profile?.name ?? "lead");

  const patchSteps = (p: Partial<Steps>) => setSteps((s) => ({ ...s, ...p }));

  // Teljes generálás: szövegek → mentés → képek → (videó). Minden lépés külön hibakezelt.
  const runAll = useCallback(async (row: LeadRow, withVideo: boolean) => {
    const id = row.id;
    const prof = getLeadProfile(row);
    setRunning(true);
    setSteps({ texts: "busy", feed: "idle", story: "idle", video: withVideo ? "idle" : "done" });
    let c = buildCsomag(row);
    setCsomag(c);
    setDirty(false);
    try {
      await saveCsomag(id, c);
      patchSteps({ texts: "done" });
    } catch (e) {
      patchSteps({ texts: "error" });
      toast({ title: "A szövegek mentése nem sikerült", description: errMsg(e), variant: "destructive" });
    }
    const img = await loadImage(prof.photoUrl);
    setPhoto(img);
    setPhotoNote(prof.photoUrl && !img ? "A lead fotója nem tölthető be a böngészőben (CORS) — monogram készült helyette. Feltölthetsz saját fotót." : null);
    const data = posterDataFrom(prof, c, img);
    for (const variant of ["feed", "story"] as const) {
      if (cancelled.current) break;
      patchSteps({ [variant]: "busy" });
      try {
        const blob = await renderPosterBlob(variant, data);
        const ref = await uploadCsomagMedia(id, variant, blob, "png", "image/png");
        c = { ...c, media: { ...c.media, [variant]: ref } };
        setCsomag(c);
        await saveCsomag(id, c);
        patchSteps({ [variant]: "done" });
      } catch (e) {
        patchSteps({ [variant]: "error" });
        toast({ title: `${POSTER_SIZE[variant].label}: mentési hiba`, description: `${errMsg(e)} — a kép letölthető marad.`, variant: "destructive" });
      }
    }
    if (withVideo && !cancelled.current) {
      patchSteps({ video: "busy" });
      try {
        const canvas = document.createElement("canvas");
        const rec = await recordVideo(canvas, data, setRecProgress);
        setVideoLocal({ url: URL.createObjectURL(rec.blob), blob: rec.blob, ext: rec.ext });
        if (!cancelled.current) {
          const ref = await uploadCsomagMedia(id, "video", rec.blob, rec.ext, rec.mime);
          c = { ...c, media: { ...c.media, video: ref } };
          setCsomag(c);
          await saveCsomag(id, c);
        }
        patchSteps({ video: "done" });
      } catch (e) {
        patchSteps({ video: "error" });
        toast({ title: "Videó: hiba", description: errMsg(e), variant: "destructive" });
      }
    }
    setRunning(false);
    onSaved?.();
  }, [onSaved, toast]);

  // Megnyitáskor: friss lead betöltése; ha még nincs csomag, azonnal legenerálja és elmenti.
  useEffect(() => {
    if (!open || !partnerId) return;
    cancelled.current = false;
    setPartner(null); setCsomag(null); setSteps(IDLE); setPosterUrls({}); setVideoLocal(null);
    setPhoto(null); setPhotoNote(null); setDirty(false); setRecProgress(0); setTab("offer");
    (async () => {
      const { data, error } = await supabase.from("partners").select("*").eq("id", partnerId).maybeSingle();
      if (error || !data) {
        toast({ title: "A lead nem tölthető be", description: error?.message, variant: "destructive" });
        return;
      }
      const row = data as unknown as LeadRow;
      setPartner(row);
      const saved = readSavedCsomag(row);
      if (saved) {
        setCsomag(saved);
        setSteps({
          texts: "done",
          feed: saved.media?.feed ? "done" : "idle",
          story: saved.media?.story ? "done" : "idle",
          video: saved.media?.video ? "done" : "idle",
        });
        const prof = getLeadProfile(row);
        const img = await loadImage(prof.photoUrl);
        setPhoto(img);
      } else {
        runAll(row, true);
      }
    })();
    return () => { cancelled.current = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, partnerId]);

  // Poszt-előnézetek frissítése, ha az ajánlat vagy a fotó változik.
  useEffect(() => {
    if (!posterData) return;
    let alive = true;
    const t = setTimeout(async () => {
      const next: Partial<Record<PosterVariant, string>> = {};
      for (const v of ["feed", "story"] as const) {
        try { next[v] = URL.createObjectURL(await renderPosterBlob(v, posterData)); } catch { /* CORS */ }
      }
      if (alive) setPosterUrls((old) => { Object.values(old).forEach((u) => u && URL.revokeObjectURL(u)); return next; });
    }, 250);
    return () => { alive = false; clearTimeout(t); };
  }, [posterData]);

  const setText = (key: keyof OutreachTexts, value: string) => {
    setCsomag((c) => (c ? { ...c, texts: { ...c.texts, [key]: value } } : c));
    setDirty(true);
  };
  const setOffer = <K extends keyof Offer>(key: K, value: Offer[K]) => {
    setCsomag((c) => (c ? { ...c, offer: { ...c.offer, [key]: value } } : c));
    setDirty(true);
  };

  const rebuildTexts = () => {
    if (!csomag || !profile) return;
    if (dirty && !confirm("A szövegeket újraírja a módosított ajánlat alapján. A kézi szövegmódosítások elvesznek. Mehet?")) return;
    setCsomag({ ...csomag, texts: buildTexts(profile, csomag.offer) });
    setDirty(true);
    setTab("texts");
  };

  const saveEdits = async () => {
    if (!csomag || !partnerId) return;
    try {
      const next = { ...csomag, generated_at: new Date().toISOString() };
      await saveCsomag(partnerId, next);
      setCsomag(next);
      setDirty(false);
      toast({ title: "Csomag mentve a leadhez" });
      onSaved?.();
    } catch (e) {
      toast({ title: "Mentési hiba", description: errMsg(e), variant: "destructive" });
    }
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} vágólapra másolva` });
  };

  const downloadAllTexts = () => {
    if (!csomag || !profile) return;
    const o = csomag.offer;
    const parts = [
      `MEGKERESÉSI CSOMAG – ${profile.name}`,
      `Generálva: ${new Date(csomag.generated_at).toLocaleString("hu-HU")}`,
      "",
      "== JAVASOLT AJÁNLAT ==",
      `Ital: ${o.item} (alkoholmentes: ${o.alcoholFreeOption})`,
      `Időablak: ${o.days}, ${o.slot}`,
      `Napi keret: ${o.dailyCap}`,
      `Indoklás: ${o.rationale}`,
      "",
      ...TEXT_FIELDS.flatMap((f) => [`== ${f.label.toUpperCase()} ==`, csomag.texts[f.key], ""]),
      ...(csomag.ai ? ["== AI-VÁLTOZAT – E-MAIL ==", csomag.ai.email_subject, "", csomag.ai.email_body, "", ...(csomag.ai.followup ? ["== AI-VÁLTOZAT – UTÁNKÖVETŐ ==", csomag.ai.followup, ""] : [])] : []),
    ];
    downloadBlob(new Blob([parts.join("\n")], { type: "text/plain;charset=utf-8" }), `${fileBase}-megkeresesi-csomag.txt`);
  };

  const aiRefine = async () => {
    if (!partnerId || !csomag || !profile) return;
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("outreach-quick-drafts", {
        body: { partner_id: partnerId, extra: aiExtraInstruction(profile, csomag.offer) },
      });
      if (error) throw error;
      const drafts: { tone: string; subject: string; body: string }[] = Array.isArray(data?.drafts) ? data.drafts : [];
      if (!drafts.length) throw new Error("Nem érkezett AI-vázlat.");
      const vars: Record<string, string> = { company_name: profile.name, contact_name: profile.contactName ?? "", first_name: "", city: profile.city ?? "Budapest" };
      const fill = (s: string) => (s ?? "").replace(/\{\{(\w+)\}\}/g, (_, k: string) => vars[k] ?? "");
      const main = drafts.find((d) => d.tone === "founding_pitch") ?? drafts[0];
      const nudge = drafts.find((d) => d.tone === "short_nudge");
      const next: OutreachCsomag = {
        ...csomag,
        source: "rule+ai",
        ai: { email_subject: fill(main.subject), email_body: fill(main.body), followup: nudge ? fill(nudge.body) : undefined, generated_at: new Date().toISOString() },
      };
      setCsomag(next);
      await saveCsomag(partnerId, next);
      toast({ title: "AI-változat elkészült és mentve" });
      setTab("texts");
    } catch (e) {
      toast({ title: "AI-finomítás nem sikerült", description: `${errMsg(e)} — a szabályalapú szövegek használhatók.`, variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const onPhotoFile = async (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const img = await loadImage(String(reader.result));
      setPhoto(img);
      setPhotoNote(img ? "Saját fotó — a mentéshez kattints a „Képek mentése” gombra." : "A fotó nem olvasható.");
    };
    reader.readAsDataURL(file);
  };

  const saveImages = async () => {
    if (!partnerId || !csomag || !posterData) return;
    let c = csomag;
    for (const variant of ["feed", "story"] as const) {
      patchSteps({ [variant]: "busy" });
      try {
        const blob = await renderPosterBlob(variant, posterData);
        const ref = await uploadCsomagMedia(partnerId, variant, blob, "png", "image/png");
        c = { ...c, media: { ...c.media, [variant]: ref } };
        patchSteps({ [variant]: "done" });
      } catch (e) {
        patchSteps({ [variant]: "error" });
        toast({ title: "Képmentési hiba", description: errMsg(e), variant: "destructive" });
      }
    }
    setCsomag(c);
    try { await saveCsomag(partnerId, c); toast({ title: "Képek mentve a leadhez" }); onSaved?.(); } catch (e) { toast({ title: "Mentési hiba", description: errMsg(e), variant: "destructive" }); }
  };

  const recordAndSave = async () => {
    if (!partnerId || !csomag || !posterData) return;
    patchSteps({ video: "busy" });
    setRecProgress(0);
    try {
      const canvas = document.createElement("canvas");
      const rec = await recordVideo(canvas, posterData, setRecProgress);
      setVideoLocal({ url: URL.createObjectURL(rec.blob), blob: rec.blob, ext: rec.ext });
      const ref = await uploadCsomagMedia(partnerId, "video", rec.blob, rec.ext, rec.mime);
      const next = { ...csomag, media: { ...csomag.media, video: ref } };
      setCsomag(next);
      await saveCsomag(partnerId, next);
      patchSteps({ video: "done" });
      toast({ title: "Videó mentve a leadhez" });
      onSaved?.();
    } catch (e) {
      patchSteps({ video: "error" });
      toast({ title: "Videó: hiba", description: errMsg(e), variant: "destructive" });
    }
  };

  const downloadPoster = async (variant: PosterVariant) => {
    if (!posterData) return;
    try {
      const blob = await renderPosterBlob(variant, posterData);
      downloadBlob(blob, `${fileBase}-${variant === "feed" ? "feed-4x5" : "story-9x16"}.png`);
    } catch (e) {
      toast({ title: "Letöltési hiba", description: errMsg(e), variant: "destructive" });
    }
  };

  // Élő videó-előnézet a Videó fülön (csak ha nincs kész felvétel).
  const previewStop = useRef<(() => void) | null>(null);
  const previewRef = useCallback((el: HTMLCanvasElement | null) => {
    previewStop.current?.();
    previewStop.current = null;
    if (el && posterData) previewStop.current = playVideoPreview(el, posterData);
  }, [posterData]);
  useEffect(() => () => previewStop.current?.(), []);

  const videoUrl = videoLocal?.url ?? csomag?.media?.video?.url ?? null;
  const videoExt = videoLocal?.ext ?? (csomag?.media?.video?.mime?.includes("mp4") ? "mp4" : "webm");
  const hasEmail = (profile?.emails.length ?? 0) > 0;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) cancelled.current = true; onOpenChange(o); }}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            <Package className="h-4 w-4 text-electric-300" />
            Megkeresési csomag: {profile?.name ?? "…"}
            {csomag?.score && <span className="text-xs font-normal text-nf-text-muted">· {csomag.score.total} pont · {csomag.score.grade}</span>}
          </DialogTitle>
        </DialogHeader>

        {!csomag ? (
          <div className="py-12 flex flex-col items-center gap-2 text-sm text-nf-text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-electric-300" /> Csomag készül…
          </div>
        ) : (
          <>
            {/* Lépések + fő gombok */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs border border-nf-border rounded-lg px-3 py-2">
              <span className="flex items-center gap-1"><StepIcon s={steps.texts} /> Szövegek</span>
              <span className="flex items-center gap-1"><StepIcon s={steps.feed} /> Feed 4:5</span>
              <span className="flex items-center gap-1"><StepIcon s={steps.story} /> Story 9:16</span>
              <span className="flex items-center gap-1"><StepIcon s={steps.video} /> Videó{steps.video === "busy" ? ` ${Math.round(recProgress * 100)}%` : ""}</span>
              <span className="text-nf-text-muted">· mentve: {new Date(csomag.generated_at).toLocaleString("hu-HU")}</span>
              <div className="ml-auto flex flex-wrap gap-2">
                <label className="flex items-center gap-1 text-nf-text-muted cursor-pointer">
                  <input type="checkbox" checked={includeVideo} onChange={(e) => setIncludeVideo(e.target.checked)} /> videóval
                </label>
                <Button size="sm" variant="outline" disabled={running || !partner} onClick={() => partner && (!dirty || confirm("Az újragenerálás felülírja a módosításokat. Mehet?")) && runAll(partner, includeVideo)}>
                  {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />} Újragenerálás
                </Button>
                <Button size="sm" variant="outline" disabled={aiLoading || running} onClick={aiRefine} title="A meglévő outreach-quick-drafts AI-függvénnyel készít egy finomított e-mail- és utánkövető-változatot">
                  {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} AI-finomítás
                </Button>
                <Button size="sm" variant="neon" disabled={!dirty || running} onClick={saveEdits}>
                  <Save className="w-3 h-3" /> Mentés
                </Button>
              </div>
            </div>

            <Tabs value={tab} onValueChange={setTab} className="mt-2">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="offer">Ajánlat</TabsTrigger>
                <TabsTrigger value="texts">Szövegek</TabsTrigger>
                <TabsTrigger value="images"><ImageIcon className="w-3 h-3 mr-1" />Képek</TabsTrigger>
                <TabsTrigger value="video"><Video className="w-3 h-3 mr-1" />Videó</TabsTrigger>
              </TabsList>

              {/* AJÁNLAT */}
              <TabsContent value="offer" className="space-y-3 mt-3">
                <div className="rounded-lg border border-electric-300/30 bg-electric-300/5 p-3 text-sm">
                  <div className="text-[10px] uppercase tracking-wider text-electric-300 mb-1">Javasolt kezdő ajánlat ({csomag.offer.kindLabel})</div>
                  <div><b>{csomag.offer.item}</b> · {csomag.offer.days}, {csomag.offer.slot} · napi {csomag.offer.dailyCap} ital</div>
                  <div className="text-xs text-nf-text-muted mt-1">{csomag.offer.rationale}</div>
                  {!csomag.offer.slotFromOpeningHours && csomag.offer.kind === "kavezo" && (
                    <div className="text-[11px] text-amber-400 mt-1">Nincs nyitvatartási adat — az időablakot a nyitáshoz igazítsd.</div>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><Label className="text-xs">Ital (teljes)</Label><Input value={csomag.offer.item} onChange={(e) => setOffer("item", e.target.value)} /></div>
                  <div><Label className="text-xs">Ital (rövid, posztokra)</Label><Input value={csomag.offer.itemShort} onChange={(e) => setOffer("itemShort", e.target.value)} /></div>
                  <div><Label className="text-xs">Alkoholmentes opció</Label><Input value={csomag.offer.alcoholFreeOption} onChange={(e) => setOffer("alcoholFreeOption", e.target.value)} /></div>
                  <div><Label className="text-xs">Napok</Label><Input value={csomag.offer.days} onChange={(e) => setOffer("days", e.target.value)} /></div>
                  <div><Label className="text-xs">Időablak</Label><Input value={csomag.offer.slot} onChange={(e) => setOffer("slot", e.target.value)} /></div>
                  <div><Label className="text-xs">Kezdő napi keret (db)</Label><Input type="number" min={1} max={50} value={csomag.offer.dailyCap} onChange={(e) => setOffer("dailyCap", Math.max(1, Number(e.target.value) || 1))} /></div>
                </div>
                <div><Label className="text-xs">Indoklás (1 mondat)</Label><Textarea rows={2} value={csomag.offer.rationale} onChange={(e) => setOffer("rationale", e.target.value)} /></div>
                <div className="flex justify-end">
                  <Button size="sm" variant="outline" onClick={rebuildTexts}><RefreshCw className="w-3 h-3" /> Szövegek frissítése az ajánlatból</Button>
                </div>
              </TabsContent>

              {/* SZÖVEGEK */}
              <TabsContent value="texts" className="space-y-3 mt-3">
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button size="sm" variant="outline" onClick={downloadAllTexts}><Download className="w-3 h-3" /> Összes szöveg (.txt)</Button>
                  <Button
                    size="sm" variant="neon" disabled={!hasEmail}
                    title={hasEmail ? "Megnyitja a meglévő e-mail küldőt előtöltve — csak a Küldés gombra megy ki" : "Ennél a leadnél nincs e-mail-cím"}
                    onClick={() => setEmailOpen({ subject: csomag.texts.emailSubject, body: csomag.texts.emailBody })}
                  >
                    <Mail className="w-3 h-3" /> E-mail megnyitása a küldőben
                  </Button>
                </div>
                {csomag.ai && (
                  <div className="rounded-lg border border-electric-300/40 p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="text-[10px] uppercase tracking-wider text-electric-300 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI-változat ({new Date(csomag.ai.generated_at).toLocaleString("hu-HU")})</div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => copy(`${csomag.ai!.email_subject}\n\n${csomag.ai!.email_body}`, "AI e-mail")}><Copy className="w-3 h-3" /> Másol</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setText("emailSubject", csomag.ai!.email_subject); setText("emailBody", csomag.ai!.email_body); if (csomag.ai!.followup) setText("followup", csomag.ai!.followup); }}>Átveszem</Button>
                      </div>
                    </div>
                    <div className="text-sm font-semibold">{csomag.ai.email_subject}</div>
                    <div className="text-xs whitespace-pre-line text-nf-text-muted">{csomag.ai.email_body}</div>
                    {csomag.ai.followup && <div className="text-xs whitespace-pre-line text-nf-text-muted border-t border-nf-border pt-2"><b className="text-nf-text">Utánkövető:</b> {csomag.ai.followup}</div>}
                  </div>
                )}
                {TEXT_FIELDS.map((f) => (
                  <div key={f.key}>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">{f.label}</Label>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => copy(csomag.texts[f.key], f.label)}><Copy className="w-3 h-3" /> Másol</Button>
                    </div>
                    {f.rows === 1 ? (
                      <Input value={csomag.texts[f.key]} onChange={(e) => setText(f.key, e.target.value)} />
                    ) : (
                      <Textarea rows={f.rows} value={csomag.texts[f.key]} onChange={(e) => setText(f.key, e.target.value)} className="text-sm resize-y" />
                    )}
                  </div>
                ))}
              </TabsContent>

              {/* KÉPEK */}
              <TabsContent value="images" className="space-y-3 mt-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <label className="inline-flex items-center gap-1 cursor-pointer border border-nf-border rounded-md px-2 h-8 hover:border-electric-300/50">
                    <Upload className="w-3 h-3" /> Saját fotó
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onPhotoFile(e.target.files?.[0])} />
                  </label>
                  {photo && <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { setPhoto(null); setPhotoNote(null); }}>Fotó nélkül</Button>}
                  <Button size="sm" variant="outline" className="h-8 ml-auto" onClick={saveImages} disabled={running}><Save className="w-3 h-3" /> Képek mentése a leadhez</Button>
                </div>
                {photoNote && <div className="text-[11px] text-amber-400">{photoNote}</div>}
                <div className="grid sm:grid-cols-2 gap-4">
                  {(["feed", "story"] as const).map((v) => (
                    <div key={v} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold">{POSTER_SIZE[v].label}</span>
                        <div className="flex gap-1">
                          {csomag.media?.[v]?.url && <a href={csomag.media[v]!.url} target="_blank" rel="noopener noreferrer" className="text-electric-300 hover:underline">mentett</a>}
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => downloadPoster(v)}><Download className="w-3 h-3" /> PNG</Button>
                        </div>
                      </div>
                      {posterUrls[v] ? (
                        <img src={posterUrls[v]} alt={`${POSTER_SIZE[v].label} – ${profile?.name}`} className="w-full rounded-lg border border-nf-border" />
                      ) : (
                        <div className="aspect-[4/5] rounded-lg border border-dashed border-nf-border flex items-center justify-center"><Loader2 className="w-4 h-4 animate-spin" /></div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* VIDEÓ */}
              <TabsContent value="video" className="space-y-3 mt-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-nf-text-muted">10 mp, 9:16, „Új partnerhely: {profile?.name}” — a böngészőben rögzítve (MP4, ha a böngésző tudja, különben WebM).</span>
                  <Button size="sm" variant="outline" className="ml-auto" onClick={recordAndSave} disabled={steps.video === "busy" || running}>
                    {steps.video === "busy" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Video className="w-3 h-3" />} {videoUrl ? "Újra felvétel" : "Felvétel"} és mentés
                  </Button>
                  {videoLocal && (
                    <Button size="sm" variant="ghost" onClick={() => downloadBlob(videoLocal.blob, `${fileBase}-uj-partnerhely.${videoLocal.ext}`)}><Download className="w-3 h-3" /> Letöltés (.{videoLocal.ext})</Button>
                  )}
                  {!videoLocal && videoUrl && (
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer" download={`${fileBase}-uj-partnerhely.${videoExt}`}><Button size="sm" variant="ghost"><Download className="w-3 h-3" /> Letöltés</Button></a>
                  )}
                </div>
                {steps.video === "busy" && <Progress value={recProgress * 100} />}
                <div className="flex justify-center">
                  {videoUrl && steps.video !== "busy" ? (
                    <video src={videoUrl} controls playsInline className="w-full max-w-xs rounded-lg border border-nf-border" />
                  ) : (
                    <canvas ref={previewRef} className="w-full max-w-xs rounded-lg border border-nf-border" />
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <p className="text-[10px] text-nf-text-muted mt-2">
              Semmi nem megy ki automatikusan: az e-mail csak az e-mail küldő „Küldés” gombjára, a DM-et és a posztokat kézzel másolod.
            </p>
          </>
        )}

        {emailOpen && partnerId && (
          <EmailComposer
            partnerIds={[partnerId]}
            initialSubject={emailOpen.subject}
            initialBody={emailOpen.body}
            onClose={() => setEmailOpen(null)}
            onDone={() => { setEmailOpen(null); onSaved?.(); }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

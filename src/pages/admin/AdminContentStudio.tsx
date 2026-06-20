import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Wand2, Loader2, Copy, Heart, Sparkles, RotateCcw, Bookmark, Image as ImageIcon,
  ImagePlus, Download, Search, Trash2, Calendar, Lightbulb, ChevronRight
} from "lucide-react";
import { composeWithLogo, downloadDataUrl } from "@/lib/compose-with-logo";

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

const ALL_FORMATS = [
  { key: "ig_caption", label: "Instagram caption" },
  { key: "ig_story", label: "Instagram Story script" },
  { key: "fb_post", label: "Facebook poszt" },
  { key: "linkedin", label: "LinkedIn poszt" },
  { key: "email_subject", label: "Email subject" },
  { key: "email_body", label: "Email body" },
  { key: "dm_opener", label: "DM nyitó" },
  { key: "whatsapp", label: "WhatsApp" },
];

type Variant = { label: string; text: string; notes?: string };
type FormatBlock = { key: string; label: string; variants: Variant[] };
type MediaMatch = { id: string; title: string; url: string; storage_path: string; score: number; reason: string; ai_description?: string };

export default function AdminContentStudio() {
  const { toast } = useToast();
  const [brief, setBrief] = useState("");
  const [persona, setPersona] = useState("");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(Object.fromEntries(ALL_FORMATS.map((f) => [f.key, true])));
  const [variantCount, setVariantCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id?: string; formats: FormatBlock[]; brand_fit_score?: number; brand_fit_notes?: string } | null>(null);
  // formatKey -> indices[] (multi-select)
  const [favorites, setFavorites] = useState<Record<string, number[]>>({});
  const [history, setHistory] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [savedFilter, setSavedFilter] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  // Media match / image gen state
  const [mediaOpen, setMediaOpen] = useState<{ formatKey: string; idx: number } | null>(null);
  const [mediaMatches, setMediaMatches] = useState<MediaMatch[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [imageBusy, setImageBusy] = useState<string | null>(null); // key:idx
  const [variantImage, setVariantImage] = useState<Record<string, { url: string; id: string }>>({});

  const loadHistory = async () => {
    const { data } = await supabase.from("content_generations").select("id, brief, persona, brand_fit_score, created_at").order("created_at", { ascending: false }).limit(10);
    setHistory(data ?? []);
  };

  const loadSaved = async () => {
    const { data } = await supabase.from("saved_content_snippets").select("*").order("created_at", { ascending: false }).limit(200);
    setSaved(data ?? []);
  };

  useEffect(() => { loadHistory(); loadSaved(); }, []);

  const generate = async () => {
    if (!brief.trim()) { toast({ title: "Adj meg egy briefet", variant: "destructive" }); return; }
    setLoading(true); setResult(null); setVariantImage({});
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const formats = ALL_FORMATS.filter((f) => enabled[f.key]).map((f) => f.key);
      const res = await fetch(`${FUNCTIONS_URL}/generate-multi-format`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ brief, persona, formats, variantCount }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "AI hiba");
      setResult(j);
      setFavorites({});
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      loadHistory();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const loadGeneration = async (id: string) => {
    const { data, error } = await supabase.from("content_generations").select("*").eq("id", id).maybeSingle();
    if (error || !data) { toast({ title: "Hiba", description: error?.message ?? "Nem található", variant: "destructive" }); return; }
    setBrief(data.brief || ""); setPersona(data.persona || "");
    setResult({ id: data.id, formats: (data.formats as any) || [], brand_fit_score: data.brand_fit_score ?? undefined });
    // legacy: single-index map → wrap into array
    const sel: any = data.selected_variants ?? {};
    const normalized: Record<string, number[]> = {};
    for (const [k, v] of Object.entries(sel)) normalized[k] = Array.isArray(v) ? v as number[] : [v as number];
    setFavorites(normalized);
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const toggleFavorite = async (formatKey: string, idx: number) => {
    const current = favorites[formatKey] ?? [];
    const next = current.includes(idx) ? current.filter((i) => i !== idx) : [...current, idx];
    const nextMap = { ...favorites, [formatKey]: next };
    if (next.length === 0) delete nextMap[formatKey];
    setFavorites(nextMap);
    if (result?.id) await supabase.from("content_generations").update({ selected_variants: nextMap as any }).eq("id", result.id);
  };

  const copyText = async (text: string) => { await navigator.clipboard.writeText(text); toast({ title: "Másolva" }); };

  const saveSnippet = async (fmt: FormatBlock, idx: number) => {
    const v = fmt.variants[idx];
    const key = `${fmt.key}:${idx}`;
    const img = variantImage[key];
    const { error } = await supabase.from("saved_content_snippets").insert({
      format_key: fmt.key, format_label: fmt.label,
      text: v.text, notes: v.notes, brief, persona,
      generation_id: result?.id ?? null,
      linked_image_doc_id: img?.id ?? null,
    });
    if (error) toast({ title: "Hiba", description: error.message, variant: "destructive" });
    else { toast({ title: "Mentve a könyvtárba" }); loadSaved(); }
  };

  const deleteSaved = async (id: string) => {
    if (!confirm("Törlöd a mentett snippetet?")) return;
    await supabase.from("saved_content_snippets").delete().eq("id", id);
    loadSaved();
  };

  const findMedia = async (formatKey: string, idx: number, text: string) => {
    setMediaOpen({ formatKey, idx }); setMediaMatches([]); setMediaLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${FUNCTIONS_URL}/match-media-for-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ text, format_key: formatKey }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Hiba");
      setMediaMatches(j.matches ?? []);
    } catch (e: any) { toast({ title: "Hiba", description: e?.message, variant: "destructive" }); }
    finally { setMediaLoading(false); }
  };

  const attachMedia = (m: MediaMatch) => {
    if (!mediaOpen) return;
    const key = `${mediaOpen.formatKey}:${mediaOpen.idx}`;
    setVariantImage((p) => ({ ...p, [key]: { url: m.url, id: m.id } }));
    setMediaOpen(null);
    toast({ title: "Kép csatolva" });
  };

  const generateImage = async (formatKey: string, idx: number, text: string) => {
    const key = `${formatKey}:${idx}`;
    setImageBusy(key);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${FUNCTIONS_URL}/generate-post-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ text, format_key: formatKey }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Hiba");
      setVariantImage((p) => ({ ...p, [key]: { url: j.url, id: j.id } }));
      toast({ title: "Kép kész", description: "Logo overlayjel letölthető." });
    } catch (e: any) { toast({ title: "Képgenerálás hiba", description: e?.message, variant: "destructive" }); }
    finally { setImageBusy(null); }
  };

  const downloadWithLogo = async (url: string, name = "come-get-it-post.png") => {
    try {
      const dataUrl = await composeWithLogo(url, { position: "top-left" });
      downloadDataUrl(dataUrl, name);
    } catch (e: any) { toast({ title: "Letöltés hiba", description: e?.message, variant: "destructive" }); }
  };

  const filteredSaved = saved.filter((s) =>
    !savedFilter || s.text.toLowerCase().includes(savedFilter.toLowerCase()) || s.format_label.toLowerCase().includes(savedFilter.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-electric-300" /> Content Studio
        </h1>
        <p className="text-sm text-nf-text-muted mt-1">
          Brief → minden formátum, mindegyik {variantCount} variánsban, brand-tone-ban. Több kedvencet is jelölhetsz egy kategóriából, mentheted későbbre, képet ajánltathatsz vagy generáltathatsz hozzá.
        </p>
      </div>

      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate"><Wand2 className="h-4 w-4 mr-1" /> Generálás</TabsTrigger>
          <TabsTrigger value="library"><Bookmark className="h-4 w-4 mr-1" /> Mentett könyvtár ({saved.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid md:grid-cols-[1fr_280px] gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Brief</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Textarea value={brief} onChange={(e) => setBrief(e.target.value)}
                  placeholder="Pl. 'Hirdesd meg a Founding Partner programot 3. ker. specialty kávézóknak...'"
                  rows={5} className="bg-nf-surface-alt border-nf-border" />
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-nf-text-muted">Persona (opcionális)</label>
                    <Input value={persona} onChange={(e) => setPersona(e.target.value)} className="bg-nf-surface-alt border-nf-border mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-nf-text-muted">Variáns / formátum</label>
                    <Input type="number" min={1} max={5} value={variantCount}
                      onChange={(e) => setVariantCount(Math.min(5, Math.max(1, Number(e.target.value) || 3)))}
                      className="bg-nf-surface-alt border-nf-border mt-1" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-nf-text-muted block mb-2">Formátumok</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_FORMATS.map((f) => (
                      <button key={f.key} onClick={() => setEnabled((p) => ({ ...p, [f.key]: !p[f.key] }))}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                          enabled[f.key] ? "bg-electric-300/15 border-electric-300/50 text-electric-300" : "border-nf-border text-nf-text-muted hover:text-white"
                        }`}>{f.label}</button>
                    ))}
                  </div>
                </div>
                <Button variant="neon" onClick={generate} disabled={loading} className="w-full">
                  {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generálás…</> : <><Sparkles className="h-4 w-4 mr-2" /> Generálj minden formátumot</>}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Korábbi briefek</CardTitle></CardHeader>
              <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                {history.length === 0 && <div className="text-xs text-nf-text-muted">Még nincs.</div>}
                {history.map((h) => (
                  <button key={h.id} onClick={() => loadGeneration(h.id)} className="w-full text-left p-2 rounded-lg bg-nf-surface-alt hover:bg-nf-surface-alt/70 text-xs">
                    <div className="font-medium truncate">{h.brief}</div>
                    <div className="text-nf-text-muted mt-0.5">
                      {new Date(h.created_at).toLocaleDateString("hu-HU")}
                      {h.brand_fit_score != null && <span className="ml-2 text-electric-300">brand-fit: {h.brand_fit_score}</span>}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div ref={outputRef} />

          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  {result.brand_fit_score != null && (
                    <div className="px-3 py-1.5 rounded-full bg-electric-300/15 text-electric-300 text-xs font-bold">
                      Brand-fit: {result.brand_fit_score}/100
                    </div>
                  )}
                  {result.brand_fit_notes && <div className="text-xs text-nf-text-muted">{result.brand_fit_notes}</div>}
                </div>
                <Button size="sm" variant="outline" onClick={generate} disabled={loading}>
                  <RotateCcw className="h-3 w-3 mr-1" /> Új variánsok
                </Button>
              </div>

              {result.formats.map((fmt) => (
                <Card key={fmt.key}>
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-base text-electric-300">{fmt.label}</CardTitle>
                    {(favorites[fmt.key]?.length ?? 0) > 0 && (
                      <Badge variant="secondary" className="bg-electric-300/15 text-electric-300 border-electric-300/30">
                        {favorites[fmt.key].length} kedvenc
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {fmt.variants.map((v, idx) => {
                      const isFav = (favorites[fmt.key] ?? []).includes(idx);
                      const key = `${fmt.key}:${idx}`;
                      const img = variantImage[key];
                      return (
                        <div key={idx} className={`p-3 rounded-lg border transition-colors ${
                          isFav ? "border-electric-300 bg-electric-300/5" : "border-nf-border bg-nf-surface-alt"
                        }`}>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="text-xs font-medium text-nf-text-muted">{v.label}</div>
                            <div className="flex gap-1">
                              <button onClick={() => toggleFavorite(fmt.key, idx)} title="Kedvenc"
                                className={`p-1 ${isFav ? "text-electric-300" : "text-nf-text-muted hover:text-electric-300"}`}>
                                <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                              </button>
                              <button onClick={() => saveSnippet(fmt, idx)} title="Mentés könyvtárba"
                                className="p-1 text-nf-text-muted hover:text-electric-300"><Bookmark className="h-4 w-4" /></button>
                              <button onClick={() => copyText(v.text)} title="Másolás"
                                className="p-1 text-nf-text-muted hover:text-electric-300"><Copy className="h-4 w-4" /></button>
                            </div>
                          </div>
                          <div className="text-sm whitespace-pre-wrap">{v.text}</div>
                          {v.notes && <div className="text-xs text-nf-text-muted mt-2 italic">{v.notes}</div>}

                          <div className="flex flex-wrap gap-2 mt-3">
                            <Button size="sm" variant="outline" onClick={() => findMedia(fmt.key, idx, v.text)}>
                              <ImageIcon className="h-3 w-3 mr-1" /> Médiatárból ajánlj
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => generateImage(fmt.key, idx, v.text)} disabled={imageBusy === key}>
                              {imageBusy === key ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <ImagePlus className="h-3 w-3 mr-1" />}
                              Generálj képet
                            </Button>
                            {img && (
                              <Button size="sm" variant="outline" onClick={() => downloadWithLogo(img.url, `cgi-${fmt.key}-v${idx + 1}.png`)}>
                                <Download className="h-3 w-3 mr-1" /> Letöltés logoval
                              </Button>
                            )}
                          </div>

                          {img && (
                            <div className="mt-3">
                              <img src={img.url} alt="" className="rounded-lg border border-nf-border max-h-72 object-cover" />
                              <div className="text-xs text-nf-text-muted mt-1">Csatolva — mentés könyvtárba ezzel a képpel kapcsolódik.</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-nf-text-muted" />
            <Input placeholder="Keresés a mentett snippetekben…" value={savedFilter} onChange={(e) => setSavedFilter(e.target.value)} className="max-w-sm bg-nf-surface-alt border-nf-border" />
          </div>
          {filteredSaved.length === 0 && <div className="text-sm text-nf-text-muted py-8 text-center">Még nincs mentés. A Generálás fülön a 📑 ikonnal menthetsz.</div>}
          <div className="grid md:grid-cols-2 gap-3">
            {filteredSaved.map((s) => (
              <Card key={s.id}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-sm text-electric-300">{s.format_label}</CardTitle>
                    <div className="text-xs text-nf-text-muted mt-0.5">{new Date(s.created_at).toLocaleDateString("hu-HU")}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => copyText(s.text)} className="p-1 text-nf-text-muted hover:text-electric-300"><Copy className="h-4 w-4" /></button>
                    <button onClick={() => deleteSaved(s.id)} className="p-1 text-nf-text-muted hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm whitespace-pre-wrap line-clamp-6">{s.text}</div>
                  {s.brief && <div className="text-xs text-nf-text-muted mt-2 italic line-clamp-2">Brief: {s.brief}</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!mediaOpen} onOpenChange={(o) => !o && setMediaOpen(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Ajánlott képek a médiatárból</DialogTitle></DialogHeader>
          {mediaLoading && <div className="py-8 text-center text-sm text-nf-text-muted"><Loader2 className="h-5 w-5 mx-auto animate-spin mb-2" /> AI rangsorolja a képeket…</div>}
          {!mediaLoading && mediaMatches.length === 0 && <div className="py-8 text-center text-sm text-nf-text-muted">Nincs találat — generálj újat az ✨ Generálj képet gombbal.</div>}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
            {mediaMatches.map((m) => (
              <button key={m.id} onClick={() => attachMedia(m)} className="text-left bg-nf-surface-alt border border-nf-border hover:border-electric-300 rounded-lg overflow-hidden transition-colors">
                <img src={m.url} alt={m.title} className="w-full h-32 object-cover" />
                <div className="p-2">
                  <div className="text-xs font-medium truncate">{m.title}</div>
                  <div className="text-[10px] text-electric-300">score {m.score}</div>
                  <div className="text-[10px] text-nf-text-muted line-clamp-2 mt-0.5">{m.reason}</div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Loader2, Copy, Heart, Sparkles, RotateCcw } from "lucide-react";

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

export default function AdminContentStudio() {
  const { toast } = useToast();
  const [brief, setBrief] = useState("");
  const [persona, setPersona] = useState("");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(Object.fromEntries(ALL_FORMATS.map((f) => [f.key, true])));
  const [variantCount, setVariantCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id?: string; formats: FormatBlock[]; brand_fit_score?: number; brand_fit_notes?: string } | null>(null);
  const [favorites, setFavorites] = useState<Record<string, number>>({}); // formatKey -> variant index
  const [history, setHistory] = useState<any[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);

  const loadHistory = async () => {
    const { data } = await supabase.from("content_generations").select("id, brief, persona, brand_fit_score, created_at").order("created_at", { ascending: false }).limit(10);
    setHistory(data ?? []);
  };

  useEffect(() => { loadHistory(); }, []);

  const generate = async () => {
    if (!brief.trim()) { toast({ title: "Adj meg egy briefet", variant: "destructive" }); return; }
    setLoading(true);
    setResult(null);
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
    } finally {
      setLoading(false);
    }
  };

  const loadGeneration = async (id: string) => {
    const { data, error } = await supabase.from("content_generations").select("*").eq("id", id).single();
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    setBrief(data.brief || "");
    setPersona(data.persona || "");
    setResult({ id: data.id, formats: (data.formats as any) || [], brand_fit_score: data.brand_fit_score ?? undefined });
    setFavorites((data.selected_variants as any) ?? {});
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const toggleFavorite = async (formatKey: string, idx: number) => {
    const next = { ...favorites };
    if (next[formatKey] === idx) delete next[formatKey];
    else next[formatKey] = idx;
    setFavorites(next);
    if (result?.id) {
      await supabase.from("content_generations").update({ selected_variants: next }).eq("id", result.id);
    }
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Másolva" });
  };

  const copyAllFavorites = async () => {
    if (!result) return;
    const parts: string[] = [`# ${brief}`, persona ? `Persona: ${persona}` : "", ""];
    for (const fmt of result.formats) {
      const favIdx = favorites[fmt.key];
      const v = favIdx != null ? fmt.variants[favIdx] : fmt.variants[0];
      if (v) parts.push(`## ${fmt.label}\n${v.text}`, "");
    }
    await navigator.clipboard.writeText(parts.join("\n"));
    toast({ title: "Kedvencek vágólapon", description: "Markdown formátumban." });
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-electric-300" /> Content Studio
        </h1>
        <p className="text-sm text-nf-text-muted mt-1">
          Egy brief → minden formátum, mindegyik {variantCount} variánsban, brand-tone-ban. Jelöld kedvencként amelyik tetszik.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Brief</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Pl. 'Hirdesd meg a Founding Partner programot 3. kerületi specialty kávézóknak. Mondj el 1 valódi értéket (asztalokra 0 forintos QR pohár) és kérj 15 perces hívást.'"
              rows={5}
              className="bg-nf-surface-alt border-nf-border"
            />
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-nf-text-muted">Célzott persona (opcionális)</label>
                <Input
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  placeholder="Pl. '3. kerületi specialty kávézó tulaj, 32-45, family-run'"
                  className="bg-nf-surface-alt border-nf-border mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-nf-text-muted">Variáns / formátum</label>
                <Input
                  type="number" min={1} max={5}
                  value={variantCount}
                  onChange={(e) => setVariantCount(Math.min(5, Math.max(1, Number(e.target.value) || 3)))}
                  className="bg-nf-surface-alt border-nf-border mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-nf-text-muted block mb-2">Formátumok</label>
              <div className="flex flex-wrap gap-2">
                {ALL_FORMATS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setEnabled((p) => ({ ...p, [f.key]: !p[f.key] }))}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      enabled[f.key]
                        ? "bg-electric-300/15 border-electric-300/50 text-electric-300"
                        : "border-nf-border text-nf-text-muted hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
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
              <button
                key={h.id}
                onClick={() => loadGeneration(h.id)}
                className="w-full text-left p-2 rounded-lg bg-nf-surface-alt hover:bg-nf-surface-alt/70 text-xs"
              >
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
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyAllFavorites}>
                <Copy className="h-3 w-3 mr-1" /> Kedvencek vágólapra
              </Button>
              <Button size="sm" variant="outline" onClick={generate} disabled={loading}>
                <RotateCcw className="h-3 w-3 mr-1" /> Új variánsok
              </Button>
            </div>
          </div>

          {result.formats.map((fmt) => (
            <Card key={fmt.key}>
              <CardHeader className="pb-3"><CardTitle className="text-base text-electric-300">{fmt.label}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {fmt.variants.map((v, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border transition-colors ${
                      favorites[fmt.key] === idx ? "border-electric-300 bg-electric-300/5" : "border-nf-border bg-nf-surface-alt"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="text-xs font-medium text-nf-text-muted">{v.label}</div>
                      <div className="flex gap-1">
                        <button onClick={() => toggleFavorite(fmt.key, idx)} className={`p-1 ${favorites[fmt.key] === idx ? "text-electric-300" : "text-nf-text-muted hover:text-electric-300"}`}>
                          <Heart className={`h-4 w-4 ${favorites[fmt.key] === idx ? "fill-current" : ""}`} />
                        </button>
                        <button onClick={() => copyText(v.text)} className="p-1 text-nf-text-muted hover:text-electric-300">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm whitespace-pre-wrap">{v.text}</div>
                    {v.notes && <div className="text-xs text-nf-text-muted mt-2 italic">{v.notes}</div>}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

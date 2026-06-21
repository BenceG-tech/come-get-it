import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ExternalLink, RefreshCw, Search, Brain, Telescope, Trash2 } from "lucide-react";
import { trackEvent } from "@/lib/track";

interface Signal {
  id: string;
  title: string;
  summary: string | null;
  source_url: string | null;
  source_title: string | null;
  category: string | null;
  relevance_score: number | null;
  query: string | null;
  published_at: string | null;
  ingested_at: string;
  metadata: any;
}

const CATEGORIES = ["all", "horeca", "consumer", "competitor", "loyalty", "custom"];

export default function AdminTrends() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [customQuery, setCustomQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [hasLiveSearch, setHasLiveSearch] = useState<boolean | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    let q = supabase.from("trend_signals").select("*").order("ingested_at", { ascending: false }).limit(80);
    if (filter !== "all") q = q.eq("category", filter);
    const { data } = await q;
    setSignals((data as any) ?? []);
    if (data && data.length) setHasLiveSearch(((data[0] as any)?.metadata?.live_search) ?? null);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  const runRadar = async (custom?: string) => {
    setRefreshing(true);
    try {
      const body = custom ? { queries: [{ q: custom, category: "custom" }] } : {};
      const { data, error } = await supabase.functions.invoke("trend-radar", { body });
      if (error) throw error;
      toast({ title: "Trend Radar lefutott", description: `${data?.inserted ?? 0} új jel · ${data?.hasLiveSearch ? "élő web search" : "AI-only (Firecrawl nincs kötve)"}` });
      setHasLiveSearch(Boolean(data?.hasLiveSearch));
      trackEvent("trend_radar_run" as any, { metadata: { custom: !!custom } });
      await load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setRefreshing(false);
    }
  };

  const remove = async (id: string) => {
    await supabase.from("trend_signals").delete().eq("id", id);
    setSignals((s) => s.filter(x => x.id !== id));
  };

  const saveAsDecision = async (s: Signal) => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { data, error } = await supabase.from("decisions").insert({
      decision_text: `Reakció trendre: ${s.title}`,
      expected_outcome: s.summary?.slice(0, 280) ?? "",
      entity_type: "trend_signal",
      entity_id: s.id,
      created_by: auth.user.id,
    }).select().single();
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    await supabase.from("trend_signals").update({ saved_to_decision_id: (data as any).id }).eq("id", s.id);
    trackEvent("trend_signal_saved" as any, { entity_type: "trend_signal", entity_id: s.id });
    toast({ title: "Mentve a döntésnaplóba" });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Telescope className="w-6 h-6 text-electric-300" /> Trend Radar</h1>
          <p className="text-sm text-nf-text-muted mt-1">Élő piaci jelek HORECA, fogyasztói, versenytárs és loyalty kategóriában. AI összegez, te döntesz.</p>
        </div>
        <Button onClick={() => runRadar()} disabled={refreshing} variant="neon">
          {refreshing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Friss keresés (alap queryk)
        </Button>
      </div>

      {hasLiveSearch === false && (
        <Card className="border-yellow-500/40 bg-yellow-500/5">
          <CardContent className="p-3 text-xs text-yellow-200">
            ⚠️ Firecrawl connector még nincs bekötve — most csak az AI általános 2026-os tudásából dolgozom, élő web search nélkül. Köss be egy Firecrawl connectiont a friss webes adatokhoz.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Search className="w-4 h-4 text-electric-300" /> Egyedi kutatás</CardTitle></CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Input
            placeholder="pl. magyar Gen Z koktél trend 2026"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && customQuery.trim()) runRadar(customQuery.trim()); }}
            className="flex-1 min-w-[240px]"
          />
          <Button onClick={() => customQuery.trim() && runRadar(customQuery.trim())} disabled={refreshing || !customQuery.trim()}>
            <Brain className="w-4 h-4 mr-2" /> Kutass és összegezz
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3 flex-wrap">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <span className="text-xs text-nf-text-muted">{signals.length} jel</span>
      </div>

      {loading && <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-electric-300" /></div>}

      <div className="grid md:grid-cols-2 gap-3">
        {signals.map(s => (
          <Card key={s.id} className="bg-nf-surface border-nf-border hover:border-electric-300/50 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold leading-snug">{s.title}</div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge variant={s.relevance_score && s.relevance_score >= 70 ? "default" : "outline"} className="text-[10px]">
                    {s.relevance_score ?? "—"}/100
                  </Badge>
                  {s.category && <span className="text-[10px] text-nf-text-muted uppercase">{s.category}</span>}
                </div>
              </div>
              {s.summary && <div className="text-sm text-nf-text-muted">{s.summary}</div>}
              <div className="flex items-center justify-between gap-2 pt-1">
                {s.source_url ? (
                  <a href={s.source_url} target="_blank" rel="noreferrer" className="text-xs text-electric-300 inline-flex items-center gap-1 hover:underline truncate max-w-[60%]">
                    <ExternalLink className="w-3 h-3" /> {s.source_title ?? s.source_url}
                  </a>
                ) : <span className="text-[10px] text-nf-text-muted">AI-only</span>}
                <span className="text-[10px] text-nf-text-muted">{new Date(s.ingested_at).toLocaleDateString("hu-HU")}</span>
              </div>
              <div className="flex gap-2 pt-2 border-t border-nf-border">
                <Button size="sm" variant="outline" onClick={() => saveAsDecision(s)}>Döntésnaplóba</Button>
                <Button size="sm" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && signals.length === 0 && (
          <div className="col-span-full text-center py-12 text-nf-text-muted text-sm">
            Még nincs jel. Nyomj a "Friss keresés"-re.
          </div>
        )}
      </div>
    </div>
  );
}

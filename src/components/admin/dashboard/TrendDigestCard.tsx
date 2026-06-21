import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Telescope, ArrowRight, Plus, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TrendDigestCard() {
  const [signals, setSignals] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [running, setRunning] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const since = new Date(Date.now() - 7 * 86400 * 1000).toISOString();
    const { data } = await supabase
      .from("trend_signals")
      .select("id,title,relevance_score,category,ingested_at,source_url")
      .gte("ingested_at", since)
      .order("relevance_score", { ascending: false })
      .limit(3);
    setSignals(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const runQuery = async () => {
    if (!query.trim()) return;
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("trend-radar", {
        body: { queries: [{ q: query.trim(), category: "custom" }] },
      });
      if (error) throw error;
      toast({ title: "Trend Radar lefutott", description: `${data?.inserted ?? 0} új jel` });
      setOpen(false);
      setQuery("");
      await load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  return (
    <Card className="border-electric-300/30 relative group">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Telescope className="w-4 h-4 text-electric-300" /> Trend Radar — top heti
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                title="Gyors trend query"
                className="ml-auto p-1 rounded-md bg-nf-bg/40 hover:bg-electric-300/20 text-nf-text-muted hover:text-electric-300 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-nf-surface border-nf-border">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-electric-300" /> Gyors trend kutatás</DialogTitle>
              </DialogHeader>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="pl. magyar Gen Z koktél trend 2026"
                onKeyDown={(e) => { if (e.key === "Enter") runQuery(); }}
                autoFocus
              />
              <Button onClick={runQuery} disabled={running || !query.trim()} variant="neon">
                {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Telescope className="w-4 h-4 mr-2" />}
                Kutass és összegezz
              </Button>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {signals.length === 0 && (
          <Link to="/admin/trends" className="text-xs text-nf-text-muted hover:text-electric-300">
            Még nincs jel — futtass radart →
          </Link>
        )}
        {signals.map((s) => (
          <Link key={s.id} to="/admin/trends" className="block p-2 rounded hover:bg-nf-surface-alt">
            <div className="text-xs font-medium line-clamp-2">{s.title}</div>
            <div className="text-[10px] text-nf-text-muted flex justify-between">
              <span>{s.category ?? "—"}{s.source_url ? " · 🔗" : ""}</span>
              <span className="text-electric-300">{s.relevance_score}/100</span>
            </div>
          </Link>
        ))}
        {signals.length > 0 && (
          <Link to="/admin/trends" className="text-[11px] text-electric-300 inline-flex items-center gap-1 pt-1">
            Összes <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

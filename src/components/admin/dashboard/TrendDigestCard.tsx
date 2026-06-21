import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Telescope, ArrowRight } from "lucide-react";

export default function TrendDigestCard() {
  const [signals, setSignals] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 7 * 86400 * 1000).toISOString();
      const { data } = await supabase
        .from("trend_signals")
        .select("id,title,relevance_score,category,ingested_at")
        .gte("ingested_at", since)
        .order("relevance_score", { ascending: false })
        .limit(3);
      setSignals(data ?? []);
    })();
  }, []);

  return (
    <Card className="border-electric-300/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Telescope className="w-4 h-4 text-electric-300" /> Trend Radar — top heti
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
              <span>{s.category ?? "—"}</span>
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

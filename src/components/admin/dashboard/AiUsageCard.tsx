import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function AiUsageCard() {
  const [today, setToday] = useState(0);
  const [topFns, setTopFns] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    (async () => {
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const { data } = await supabase
        .from("metric_events")
        .select("event_type, metadata")
        .in("event_type", ["ai_call", "doc_chat_v2_used", "decision_created", "trend_radar_run", "lead_auto_research", "health_radar_viewed", "doc_semantic_search"])
        .gte("created_at", start.toISOString())
        .limit(500);
      const rows = data ?? [];
      setToday(rows.length);
      const counts: Record<string, number> = {};
      rows.forEach((r: any) => { const k = (r.metadata?.fn as string) ?? r.event_type; counts[k] = (counts[k] ?? 0) + 1; });
      setTopFns(Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name, count]) => ({ name, count })));
    })();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-electric-300" /> AI használat ma
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-electric-300">{today}</div>
        <div className="text-[10px] text-nf-text-muted uppercase tracking-wider">hívás összesen</div>
        <div className="mt-3 space-y-1">
          {topFns.map((f) => (
            <div key={f.name} className="flex justify-between text-xs">
              <span className="text-nf-text-muted truncate">{f.name}</span>
              <span className="font-semibold">{f.count}</span>
            </div>
          ))}
          {topFns.length === 0 && <div className="text-xs text-nf-text-muted">Még nincs AI hívás ma.</div>}
        </div>
      </CardContent>
    </Card>
  );
}

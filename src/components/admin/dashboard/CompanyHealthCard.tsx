import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowUp, ArrowDown, Minus } from "lucide-react";

type Dim = { key: string; label: string; score: number; prev: number };

export default function CompanyHealthCard() {
  const [dims, setDims] = useState<Dim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 86400e3).toISOString();
      const twoWeeksAgo = new Date(now.getTime() - 14 * 86400e3).toISOString();

      const [partners, leadsNew, leadsPrev, posts, postsPrev, docs, docsPrev, outreach, outreachPrev] = await Promise.all([
        supabase.from("partners").select("id,status,lead_score"),
        supabase.from("partners").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
        supabase.from("partners").select("id", { count: "exact", head: true }).gte("created_at", twoWeeksAgo).lt("created_at", weekAgo),
        supabase.from("marketing_calendar").select("id", { count: "exact", head: true }).eq("status", "posted").gte("scheduled_at", weekAgo),
        supabase.from("marketing_calendar").select("id", { count: "exact", head: true }).eq("status", "posted").gte("scheduled_at", twoWeeksAgo).lt("scheduled_at", weekAgo),
        supabase.from("documents").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
        supabase.from("documents").select("id", { count: "exact", head: true }).gte("created_at", twoWeeksAgo).lt("created_at", weekAgo),
        supabase.from("outreach_events").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
        supabase.from("outreach_events").select("id", { count: "exact", head: true }).gte("created_at", twoWeeksAgo).lt("created_at", weekAgo),
      ]);

      const all = partners.data ?? [];
      const signed = all.filter((p: any) => p.status === "signed").length;
      const avgScore = all.length ? all.reduce((a: number, p: any) => a + (p.lead_score ?? 0), 0) / all.length : 0;

      const norm = (n: number, target: number) => Math.min(100, Math.round((n / target) * 100));

      setDims([
        { key: "pipeline", label: "Pipeline", score: norm(leadsNew.count ?? 0, 5), prev: norm(leadsPrev.count ?? 0, 5) },
        { key: "outreach", label: "Outreach", score: norm(outreach.count ?? 0, 20), prev: norm(outreachPrev.count ?? 0, 20) },
        { key: "content", label: "Content", score: norm(posts.count ?? 0, 5), prev: norm(postsPrev.count ?? 0, 5) },
        { key: "knowledge", label: "Tudás", score: norm(docs.count ?? 0, 3), prev: norm(docsPrev.count ?? 0, 3) },
        { key: "quality", label: "Lead minőség", score: Math.round(avgScore), prev: Math.round(avgScore) },
        { key: "conversion", label: "Konverzió", score: all.length ? Math.round((signed / all.length) * 100) : 0, prev: 0 },
      ]);
      setLoading(false);
    })();
  }, []);

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-electric-300" /> Cég health (heti)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-xs text-nf-text-muted">Számolom…</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {dims.map((d) => {
              const delta = d.score - d.prev;
              const Trend = delta > 2 ? ArrowUp : delta < -2 ? ArrowDown : Minus;
              const color = delta > 2 ? "text-emerald-400" : delta < -2 ? "text-red-400" : "text-nf-text-muted";
              return (
                <div key={d.key} className="rounded-lg bg-nf-surface-alt p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-nf-text-muted">{d.label}</span>
                    <Trend className={`w-3 h-3 ${color}`} />
                  </div>
                  <div className="text-2xl font-bold text-electric-300 mt-1">{d.score}</div>
                  <div className="h-1 mt-1 bg-nf-bg rounded-full overflow-hidden">
                    <div className="h-full bg-electric-300" style={{ width: `${d.score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

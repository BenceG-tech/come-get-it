import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export function WaitlistGrowth() {
  const [stats, setStats] = useState({ total: 0, today: 0, week: 0, month: 0 });
  const [spark, setSpark] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const startToday = new Date(now); startToday.setHours(0, 0, 0, 0);
      const start7 = new Date(now.getTime() - 7 * 86400000);
      const start30 = new Date(now.getTime() - 30 * 86400000);

      const [t, d, w, m, recent] = await Promise.all([
        supabase.from("waitlist_signups").select("id", { count: "exact", head: true }),
        supabase.from("waitlist_signups").select("id", { count: "exact", head: true }).gte("created_at", startToday.toISOString()),
        supabase.from("waitlist_signups").select("id", { count: "exact", head: true }).gte("created_at", start7.toISOString()),
        supabase.from("waitlist_signups").select("id", { count: "exact", head: true }).gte("created_at", start30.toISOString()),
        supabase.from("waitlist_signups").select("created_at").gte("created_at", start30.toISOString()),
      ]);

      setStats({ total: t.count ?? 0, today: d.count ?? 0, week: w.count ?? 0, month: m.count ?? 0 });

      // 30 day sparkline
      const buckets = Array(30).fill(0);
      (recent.data ?? []).forEach((r: any) => {
        const days = Math.floor((now.getTime() - new Date(r.created_at).getTime()) / 86400000);
        if (days >= 0 && days < 30) buckets[29 - days]++;
      });
      setSpark(buckets);
    })();
  }, []);

  const max = Math.max(1, ...spark);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4 text-electric-300" /> Waitlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{stats.total}</div>
        <div className="flex gap-4 text-xs text-nf-text-muted mt-1 mb-3">
          <span><span className="text-electric-300 font-bold">+{stats.today}</span> ma</span>
          <span><span className="text-electric-300 font-bold">+{stats.week}</span> / 7n</span>
          <span><span className="text-electric-300 font-bold">+{stats.month}</span> / 30n</span>
        </div>
        <div className="flex items-end gap-[2px] h-10">
          {spark.map((v, i) => (
            <div
              key={i}
              className="flex-1 bg-electric-300/60 rounded-sm min-h-[2px]"
              style={{ height: `${(v / max) * 100}%` }}
              title={`${v} signup`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

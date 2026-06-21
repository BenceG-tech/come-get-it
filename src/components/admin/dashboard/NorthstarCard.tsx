import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function NorthstarCard() {
  const [thisMonth, setThisMonth] = useState(0);
  const [lastMonth, setLastMonth] = useState(0);
  const [target] = useState(10); // havi cél: 10 aláírt partner — később configurable

  useEffect(() => {
    (async () => {
      const now = new Date();
      const startThis = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const startLast = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const endLast = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

      const [a, b] = await Promise.all([
        supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "signed").gte("created_at", startThis),
        supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "signed").gte("created_at", startLast).lte("created_at", endLast),
      ]);
      setThisMonth(a.count ?? 0);
      setLastMonth(b.count ?? 0);
    })();
  }, []);

  const delta = thisMonth - lastMonth;
  const pct = target > 0 ? Math.min(100, (thisMonth / target) * 100) : 0;
  const Trend = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const trendColor = delta > 0 ? "text-emerald-400" : delta < 0 ? "text-red-400" : "text-nf-text-muted";

  return (
    <Card className="border-electric-300/40 bg-gradient-to-br from-electric-300/10 to-transparent">
      <CardContent className="p-5">
        <div className="text-[10px] uppercase tracking-widest text-nf-text-muted mb-1">⭐ Northstar — havi aláírt partner</div>
        <div className="flex items-baseline gap-3 mt-2">
          <div className="text-5xl font-bold text-electric-300">{thisMonth}</div>
          <div className="text-sm text-nf-text-muted">/ {target} cél</div>
          <div className={`ml-auto flex items-center gap-1 text-sm ${trendColor}`}>
            <Trend className="w-4 h-4" /> {delta > 0 ? "+" : ""}{delta} vs előző hó
          </div>
        </div>
        <div className="mt-3 h-2 bg-nf-surface-alt rounded-full overflow-hidden">
          <div className="h-full bg-electric-300 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-[10px] text-nf-text-muted mt-1">{pct.toFixed(0)}% a havi célból</div>
      </CardContent>
    </Card>
  );
}

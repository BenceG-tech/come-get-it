import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, ArrowRight } from "lucide-react";

type Goal = { id: string; title: string; metric: string | null; target: number; actual: number; status: string };

function weekStart(): string {
  const d = new Date();
  const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10);
}

export function WeeklyGoalsCard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("weekly_goals").select("*").eq("week_start", weekStart()).order("created_at");
      setGoals((data as any) ?? []);
    })();
  }, []);

  return (
    <Card className="border-electric-300/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-4 w-4 text-electric-300" /> Heti célok
          <Link to="/admin/retro" className="ml-auto text-xs text-electric-300 hover:underline flex items-center gap-1">
            Retro <ArrowRight className="h-3 w-3" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {goals.length === 0 && (
          <div className="text-sm text-nf-text-muted">Nincs aktív heti cél. <Link to="/admin/retro" className="text-electric-300 underline">Adj hozzá</Link></div>
        )}
        {goals.map((g) => {
          const pct = g.target > 0 ? Math.min(100, Math.round((Number(g.actual) / Number(g.target)) * 100)) : 0;
          return (
            <div key={g.id} className="space-y-1">
              <div className="flex justify-between text-xs"><span className="truncate">{g.title}</span><span className="text-nf-text-muted">{g.actual}/{g.target}</span></div>
              <Progress value={pct} className="h-1.5" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

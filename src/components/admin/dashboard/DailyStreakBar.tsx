import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Streak + heti cél sáv. Motiváló, mindig fent.
 * - Streak: hány egymás utáni napon volt legalább egy 'posted' bejegyzés a marketing_calendar-ban.
 * - Heti poszt: ezen a héten (hétfő-vasárnap) hány 'posted' bejegyzés van — cél: 7.
 */
export default function DailyStreakBar() {
  const [streak, setStreak] = useState(0);
  const [weekly, setWeekly] = useState({ done: 0, target: 7 });

  useEffect(() => {
    (async () => {
      // Az utolsó 30 nap posztjai
      const since = new Date();
      since.setDate(since.getDate() - 30);
      const { data } = await supabase
        .from("marketing_calendar")
        .select("scheduled_date, status")
        .gte("scheduled_date", since.toISOString().slice(0, 10))
        .eq("status", "posted");

      const days = new Set((data ?? []).map((r: any) => r.scheduled_date));

      // streak: visszafelé számolva a maitól
      let s = 0;
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      for (let i = 0; i < 30; i++) {
        const key = d.toISOString().slice(0, 10);
        if (days.has(key)) s++;
        else if (i > 0) break; // ma még lehet 0, ne törje meg
        d.setDate(d.getDate() - 1);
      }
      setStreak(s);

      // ezen a héten (hétfő-vasárnap)
      const today = new Date();
      const dow = (today.getDay() + 6) % 7; // hétfő = 0
      const monday = new Date(today);
      monday.setDate(today.getDate() - dow);
      monday.setHours(0, 0, 0, 0);
      const mondayKey = monday.toISOString().slice(0, 10);
      const done = Array.from(days).filter((k) => k >= mondayKey).length;
      setWeekly({ done, target: 7 });
    })();
  }, []);

  const weekPct = Math.min(100, Math.round((weekly.done / weekly.target) * 100));

  return (
    <div className="rounded-xl border border-electric-300/30 bg-gradient-to-r from-electric-300/5 to-transparent p-4 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <div className={cn("h-9 w-9 rounded-full flex items-center justify-center", streak > 0 ? "bg-orange-500/15 text-orange-400" : "bg-nf-surface-alt text-nf-text-muted")}>
          <Flame className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-bold leading-none">{streak} {streak === 1 ? "nap" : "nap"}</div>
          <div className="text-[10px] text-nf-text-muted uppercase tracking-wider mt-0.5">Streak</div>
        </div>
      </div>

      <div className="h-8 w-px bg-nf-border hidden sm:block" />

      <div className="flex-1 min-w-[180px]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="flex items-center gap-1.5 text-nf-text-muted">
            <Target className="h-3.5 w-3.5" /> Heti poszt cél
          </span>
          <span className="font-bold text-electric-300">{weekly.done} / {weekly.target}</span>
        </div>
        <div className="h-2 rounded-full bg-nf-surface-alt overflow-hidden">
          <div className="h-full bg-gradient-to-r from-electric-300 to-electric-300/60 transition-all" style={{ width: `${weekPct}%` }} />
        </div>
      </div>

      {streak === 0 && (
        <div className="text-xs text-nf-text-muted flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Kezdj egy streaket — posztolj ma!</span>
        </div>
      )}
      {streak >= 3 && (
        <div className="text-xs text-orange-300 flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5" />
          <span>Ne hagyd abba!</span>
        </div>
      )}
    </div>
  );
}

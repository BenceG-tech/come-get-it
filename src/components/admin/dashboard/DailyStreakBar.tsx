import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Streak + heti cél sáv. Motiváló, mindig fent.
 * Adatforrás: public.user_streaks (per-user). Fallback: marketing_calendar 'posted'.
 * Ha még nincs user_streaks rekord, számol és insertel egyet.
 */
export default function DailyStreakBar() {
  const [streak, setStreak] = useState(0);
  const [weekly, setWeekly] = useState({ done: 0, target: 7 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1) próbáljuk user_streaks-ből
        const { data: row } = await supabase
          .from("user_streaks")
          .select("current_streak, weekly_goal, weekly_progress, week_start, last_action_date")
          .eq("user_id", user.id)
          .maybeSingle();

        // 2) ha nincs vagy elavult heti adat — számoljuk a marketing_calendar-ból
        const today = new Date();
        const dow = (today.getDay() + 6) % 7; // hétfő = 0
        const monday = new Date(today);
        monday.setDate(today.getDate() - dow);
        monday.setHours(0, 0, 0, 0);
        const mondayKey = monday.toISOString().slice(0, 10);

        const since = new Date();
        since.setDate(since.getDate() - 30);
        const { data: cal } = await supabase
          .from("marketing_calendar")
          .select("scheduled_date, status")
          .gte("scheduled_date", since.toISOString().slice(0, 10))
          .eq("status", "posted");
        const days = new Set((cal ?? []).map((r: any) => r.scheduled_date));

        let s = 0;
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        for (let i = 0; i < 30; i++) {
          const key = d.toISOString().slice(0, 10);
          if (days.has(key)) s++;
          else if (i > 0) break;
          d.setDate(d.getDate() - 1);
        }
        const weekDone = Array.from(days).filter((k) => k >= mondayKey).length;

        // upsert user_streaks
        const goal = row?.weekly_goal ?? 7;
        await supabase.from("user_streaks").upsert({
          user_id: user.id,
          current_streak: s,
          longest_streak: Math.max(s, row?.current_streak ?? 0),
          last_action_date: s > 0 ? new Date().toISOString().slice(0, 10) : row?.last_action_date ?? null,
          weekly_goal: goal,
          weekly_progress: weekDone,
          week_start: mondayKey,
        }, { onConflict: "user_id" });

        setStreak(s);
        setWeekly({ done: weekDone, target: goal });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const weekPct = Math.min(100, Math.round((weekly.done / Math.max(weekly.target, 1)) * 100));

  return (
    <div className="rounded-xl border border-electric-300/30 bg-gradient-to-r from-electric-300/5 to-transparent p-4 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <div className={cn("h-9 w-9 rounded-full flex items-center justify-center", streak > 0 ? "bg-orange-500/15 text-orange-400" : "bg-nf-surface-alt text-nf-text-muted")}>
          <Flame className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-bold leading-none">{streak} nap</div>
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

      {!loading && streak === 0 && (
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

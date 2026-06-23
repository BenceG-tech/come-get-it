import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Moon, CheckCircle2, ArrowRight } from "lucide-react";

/**
 * Esti összefoglaló — csak 18:00 után jelenik meg.
 * Megmutatja a mai elvégzett dolgokat és a holnapi fókuszt.
 */
export default function EveningSummaryCard() {
  const [stats, setStats] = useState({ posts: 0, interactions: 0, signedToday: 0 });
  const [tomorrowFocus, setTomorrowFocus] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 18) return;
    setVisible(true);

    (async () => {
      const todayKey = new Date().toISOString().slice(0, 10);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowKey = tomorrow.toISOString().slice(0, 10);

      const [posts, inter, signed, focus] = await Promise.all([
        supabase.from("marketing_calendar").select("id", { count: "exact", head: true }).eq("status", "posted").eq("scheduled_date", todayKey),
        supabase.from("partner_interactions").select("id", { count: "exact", head: true }).gte("occurred_at", `${todayKey}T00:00:00`),
        supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "signed").gte("updated_at", `${todayKey}T00:00:00`),
        supabase.from("marketing_calendar").select("title, channel").eq("scheduled_date", tomorrowKey).limit(3),
      ]);

      setStats({
        posts: posts.count ?? 0,
        interactions: inter.count ?? 0,
        signedToday: signed.count ?? 0,
      });
      setTomorrowFocus((focus.data ?? []).map((r: any) => `${r.channel}: ${r.title}`));
    })();
  }, []);

  if (!visible) return null;

  const nothing = stats.posts === 0 && stats.interactions === 0 && stats.signedToday === 0;

  return (
    <div className="rounded-xl border border-nf-border bg-gradient-to-br from-indigo-500/5 to-electric-300/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Moon className="h-4 w-4 text-indigo-300" />
        <h3 className="font-bold text-sm">Esti összefoglaló</h3>
      </div>

      {nothing ? (
        <p className="text-sm text-nf-text-muted">
          Ma még nincs lezárt akció — pihenj kicsit, vagy zárj le egyet a holnapi fókuszhoz. 💪
        </p>
      ) : (
        <ul className="space-y-1.5 text-sm">
          {stats.posts > 0 && (
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-electric-300" /> {stats.posts} poszt posztolva</li>
          )}
          {stats.interactions > 0 && (
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-electric-300" /> {stats.interactions} partner interakció</li>
          )}
          {stats.signedToday > 0 && (
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-300" /> 🎉 {stats.signedToday} új aláírt partner!</li>
          )}
        </ul>
      )}

      {tomorrowFocus.length > 0 && (
        <div className="border-t border-nf-border pt-3">
          <div className="text-[10px] uppercase tracking-wider text-nf-text-muted mb-1.5">Holnap a naptárban</div>
          <ul className="space-y-1 text-xs text-nf-text-muted">
            {tomorrowFocus.map((t, i) => <li key={i}>• {t}</li>)}
          </ul>
        </div>
      )}

      <Link to="/admin/calendar" className="inline-flex items-center gap-1 text-xs text-electric-300 hover:underline">
        Naptár megnyitása <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

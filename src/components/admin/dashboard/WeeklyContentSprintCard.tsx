import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, FileText, Calendar as CalIcon } from "lucide-react";

function weekRange() {
  const now = new Date();
  const day = now.getDay() || 7;
  const start = new Date(now); start.setDate(now.getDate() - day + 1); start.setHours(0, 0, 0, 0);
  const end = new Date(start); end.setDate(start.getDate() + 6); end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function WeeklyContentSprintCard() {
  const [stats, setStats] = useState({ scheduled: 0, published: 0, draft: 0, briefsApproved: 0, briefsInProd: 0 });
  const [byChannel, setByChannel] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = async () => {
      const { start, end } = weekRange();
      const s = start.toISOString().slice(0, 10);
      const e = end.toISOString().slice(0, 10);
      const [{ data: cal }, { data: briefs }] = await Promise.all([
        supabase.from("marketing_calendar").select("status, channel").gte("scheduled_date", s).lte("scheduled_date", e),
        supabase.from("content_briefs").select("status"),
      ]);
      const cnt: Record<string, number> = {};
      let scheduled = 0, published = 0, draft = 0;
      for (const c of cal ?? []) {
        cnt[c.channel] = (cnt[c.channel] ?? 0) + 1;
        if (c.status === "posted" || c.status === "ready") scheduled++;
        if (c.status === "posted") published++;
        if (c.status === "draft" || c.status === "idea") draft++;
      }
      setByChannel(cnt);
      setStats({
        scheduled, published, draft,
        briefsApproved: (briefs ?? []).filter((b: any) => b.status === "approved").length,
        briefsInProd: (briefs ?? []).filter((b: any) => b.status === "in_production").length,
      });
    };
    load();
  }, []);

  const missingChannels = ["instagram", "facebook", "linkedin"].filter((c) => !byChannel[c]);

  return (
    <Card className="border-electric-300/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-electric-300" /> Heti content sprint
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded bg-nf-surface-alt">
            <div className="text-xl font-bold text-electric-300">{stats.published}</div>
            <div className="text-[10px] uppercase text-nf-text-muted">Publikált</div>
          </div>
          <div className="p-2 rounded bg-nf-surface-alt">
            <div className="text-xl font-bold">{stats.scheduled}</div>
            <div className="text-[10px] uppercase text-nf-text-muted">Ütemezett</div>
          </div>
          <div className="p-2 rounded bg-nf-surface-alt">
            <div className="text-xl font-bold text-amber-300">{stats.draft}</div>
            <div className="text-[10px] uppercase text-nf-text-muted">Draft</div>
          </div>
        </div>
        <div className="text-xs text-nf-text-muted flex items-center justify-between">
          <span><FileText className="h-3 w-3 inline mr-1" /> {stats.briefsApproved} approved · {stats.briefsInProd} folyamatban</span>
          <Link to="/admin/content" className="text-electric-300 hover:underline">Briefek →</Link>
        </div>
        {missingChannels.length > 0 && (
          <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded p-2">
            ⚠️ Ezen a héten hiányzó csatornák: {missingChannels.join(", ")}
          </div>
        )}
        <Link to="/admin/calendar" className="block text-center text-xs text-electric-300 hover:underline">
          <CalIcon className="h-3 w-3 inline mr-1" /> Marketing naptár
        </Link>
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Send, AlertTriangle, Reply } from "lucide-react";
import { Link } from "react-router-dom";

export default function OutreachHealthCard() {
  const [data, setData] = useState({ sent: 0, replied: 0, slaBreaches: 0, activeEnrollments: 0 });

  useEffect(() => {
    (async () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const [ev, en, stages, partners] = await Promise.all([
        supabase.from("outreach_events").select("status").gte("sent_at", sevenDaysAgo),
        supabase.from("outreach_enrollments").select("id").eq("status", "active"),
        supabase.from("pipeline_stages").select("id, sla_days"),
        supabase.from("partners").select("id, stage_id, updated_at").not("stage_id", "is", null),
      ]);
      const evs = (ev.data ?? []) as any[];
      const stageMap = new Map((stages.data ?? []).map((s: any) => [s.id, s.sla_days ?? 7]));
      let breaches = 0;
      for (const p of (partners.data ?? []) as any[]) {
        const sla = stageMap.get(p.stage_id);
        if (!sla) continue;
        const ageDays = (Date.now() - new Date(p.updated_at).getTime()) / 86400000;
        if (ageDays > sla) breaches++;
      }
      setData({
        sent: evs.filter((e) => e.status === "sent" || e.status === "opened" || e.status === "clicked" || e.status === "replied").length,
        replied: evs.filter((e) => e.status === "replied").length,
        slaBreaches: breaches,
        activeEnrollments: (en.data ?? []).length,
      });
    })();
  }, []);

  return (
    <Card className="p-4 bg-nf-surface border-nf-border">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-white">Outreach health</div>
        <Link to="/admin/outreach" className="text-xs text-electric-300 hover:underline">Megnyit →</Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Send className="h-4 w-4 text-electric-300" />
          <div>
            <div className="text-xl font-bold text-white">{data.sent}</div>
            <div className="text-[10px] text-nf-text-muted uppercase">7 napos send</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Reply className="h-4 w-4 text-emerald-400" />
          <div>
            <div className="text-xl font-bold text-white">{data.replied}</div>
            <div className="text-[10px] text-nf-text-muted uppercase">Válasz</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-electric-300/30" />
          <div>
            <div className="text-xl font-bold text-white">{data.activeEnrollments}</div>
            <div className="text-[10px] text-nf-text-muted uppercase">Aktív futás</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className={`h-4 w-4 ${data.slaBreaches > 0 ? "text-amber-400" : "text-nf-text-muted"}`} />
          <div>
            <div className="text-xl font-bold text-white">{data.slaBreaches}</div>
            <div className="text-[10px] text-nf-text-muted uppercase">SLA túllépés</div>
          </div>
        </div>
      </div>
      {data.slaBreaches > 0 && (
        <Badge variant="outline" className="mt-3 text-amber-400 border-amber-400/40">
          {data.slaBreaches} partner SLA-n túl van — nézd meg
        </Badge>
      )}
    </Card>
  );
}

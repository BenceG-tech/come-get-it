import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Activity, UserPlus, FileSignature, Mail, Users } from "lucide-react";

type Event = { kind: string; label: string; at: string; icon: any };

export default function MissionTimeline() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      const [partners, transitions, signups] = await Promise.all([
        supabase.from("partners").select("company_name, status, created_at").gte("created_at", since).order("created_at", { ascending: false }).limit(20),
        supabase.from("pipeline_transitions").select("from_stage, to_stage, created_at, partner_id").gte("created_at", since).order("created_at", { ascending: false }).limit(20),
        supabase.from("waitlist_signups").select("email, source, created_at").gte("created_at", since).order("created_at", { ascending: false }).limit(50),
      ]);

      const ev: Event[] = [];
      (partners.data ?? []).forEach((p: any) => ev.push({
        kind: "partner", label: `Új partner: ${p.company_name} (${p.status})`, at: p.created_at, icon: UserPlus,
      }));
      (transitions.data ?? []).forEach((t: any) => {
        if (t.to_stage === "signed" || t.to_stage === "proposal_sent" || t.to_stage === "negotiating") {
          ev.push({ kind: "transition", label: `Pipeline: ${t.from_stage ?? "?"} → ${t.to_stage}`, at: t.created_at, icon: FileSignature });
        }
      });
      // waitlist milestones
      const wlCount = signups.data?.length ?? 0;
      if (wlCount > 0) {
        ev.push({ kind: "waitlist", label: `+${wlCount} új waitlist signup elmúlt 30 nap`, at: signups.data![0].created_at, icon: Users });
      }

      ev.sort((a, b) => b.at.localeCompare(a.at));
      setEvents(ev.slice(0, 30));
    })();
  }, []);

  return (
    <Card className="p-4 md:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-electric-300" />
        <h3 className="font-bold">Misszió timeline — utolsó 30 nap</h3>
      </div>
      {events.length === 0 && <div className="text-sm text-nf-text-muted">Nincs releváns esemény.</div>}
      <div className="space-y-2">
        {events.map((e, i) => {
          const Icon = e.icon;
          return (
            <div key={i} className="flex items-center gap-3 py-2 px-2 rounded hover:bg-nf-surface-alt/50 border-l-2 border-electric-300/30">
              <Icon className="h-3.5 w-3.5 text-electric-300 shrink-0" />
              <div className="text-sm flex-1 truncate">{e.label}</div>
              <div className="text-[10px] text-nf-text-muted whitespace-nowrap">
                {new Date(e.at).toLocaleDateString("hu-HU", { month: "short", day: "numeric" })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

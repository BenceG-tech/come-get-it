import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, ArrowRight } from "lucide-react";

type Step = { key: string; label: string; count: number; color: string };

export function ConversionFunnel() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [leadsR, contactedR, signedR, eventsR, enrollsR] = await Promise.all([
        supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "lead"),
        supabase.from("partners").select("id", { count: "exact", head: true }).in("status", ["contacted", "proposal_sent", "negotiating"]),
        supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "signed"),
        supabase.from("outreach_events").select("enrollment_id").not("replied_at", "is", null).limit(5000),
        supabase.from("outreach_enrollments").select("id, entity_id").eq("entity_type", "partner"),
      ]);

      const replyEnrolls = new Set((eventsR.data ?? []).map((e: any) => e.enrollment_id));
      const repliedEntities = new Set(
        (enrollsR.data ?? []).filter((e: any) => replyEnrolls.has(e.id)).map((e: any) => e.entity_id)
      );

      setSteps([
        { key: "lead", label: "Lead", count: leadsR.count ?? 0, color: "from-slate-500 to-slate-600" },
        { key: "contacted", label: "Megkeresve", count: contactedR.count ?? 0, color: "from-blue-500 to-blue-600" },
        { key: "replied", label: "Válaszolt", count: repliedEntities.size, color: "from-amber-400 to-amber-500" },
        { key: "signed", label: "Aláírt", count: signedR.count ?? 0, color: "from-emerald-500 to-emerald-600" },
      ]);
      setLoading(false);
    })();
  }, []);

  const max = Math.max(1, ...steps.map((s) => s.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <GitBranch className="h-4 w-4 text-electric-300" /> Konverziós tölcsér
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((s, i) => {
          const pct = Math.round((s.count / max) * 100);
          const conv = i > 0 && steps[i - 1].count > 0
            ? Math.round((s.count / steps[i - 1].count) * 100)
            : null;
          return (
            <div key={s.key}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-nf-text-muted">{s.label}</span>
                <div className="flex items-center gap-2">
                  {conv !== null && (
                    <span className="text-[10px] text-nf-text-muted flex items-center gap-0.5">
                      <ArrowRight className="h-3 w-3" />{conv}%
                    </span>
                  )}
                  <span className="font-bold">{s.count}</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-nf-surface-alt overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${s.color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
        {!loading && steps.length > 0 && (
          <Link to="/admin/partners" className="block text-xs text-electric-300 hover:underline pt-1">
            Teljes pipeline →
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

export default ConversionFunnel;

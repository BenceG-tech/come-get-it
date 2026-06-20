import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import LeadScoreBadge from "./LeadScoreBadge";
import SlaWarningBadge from "@/components/admin/crm/SlaWarningBadge";
import { trackEvent } from "@/lib/track";

type Stage = { id?: string; key: string; label: string; sla_days: number | null; order_index: number };

const FALLBACK: Stage[] = [
  { key: "lead", label: "Új lead", sla_days: null, order_index: 0 },
  { key: "contacted", label: "Megkeresve", sla_days: null, order_index: 1 },
  { key: "negotiating", label: "Tárgyalás", sla_days: null, order_index: 2 },
  { key: "proposal_sent", label: "Ajánlat", sla_days: null, order_index: 3 },
  { key: "signed", label: "Aláírt", sla_days: null, order_index: 4 },
  { key: "rejected", label: "Elutasítva", sla_days: null, order_index: 5 },
];

export default function LeadsKanban({ partners, onStatusChange }: { partners: any[]; onStatusChange: (id: string, status: string) => void }) {
  const [stages, setStages] = useState<Stage[]>(FALLBACK);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("pipeline_stages")
        .select("id, key, label, sla_days, order_index")
        .eq("kind", "lead")
        .order("order_index");
      if (data && data.length > 0) setStages(data as any);
    })();
  }, []);

  const byStatus: Record<string, any[]> = {};
  stages.forEach((s) => (byStatus[s.key] = []));
  partners.forEach((p) => { (byStatus[p.status] ??= []).push(p); });

  const onDragStart = (e: React.DragEvent, id: string, fromStatus: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.setData("from-status", fromStatus);
  };
  const onDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const from = e.dataTransfer.getData("from-status");
    if (!id || from === status) return;
    onStatusChange(id, status);
    const fromStage = stages.find((s) => s.key === from);
    const toStage = stages.find((s) => s.key === status);
    const { data: auth } = await supabase.auth.getUser();
    await supabase.from("pipeline_transitions").insert({
      entity_type: "partner",
      entity_id: id,
      from_stage_id: fromStage?.id ?? null,
      to_stage_id: toStage?.id ?? null,
      by_user: auth.user?.id ?? null,
    });
    trackEvent("stage_transition", { entity_type: "partner", entity_id: id, metadata: { from, to: status } });
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {stages.map((s) => (
        <div key={s.key} className="w-72 shrink-0" onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, s.key)}>
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="text-xs uppercase tracking-wider text-nf-text-muted font-semibold">{s.label}</div>
            <div className="text-xs text-nf-text-muted">{byStatus[s.key]?.length ?? 0}</div>
          </div>
          <div className="space-y-2 min-h-[200px] p-2 rounded-lg bg-nf-surface-alt/30">
            {(byStatus[s.key] ?? []).map((p) => (
              <Card
                key={p.id}
                draggable
                onDragStart={(e) => onDragStart(e, p.id, s.key)}
                className="p-3 hover:border-electric-300/50 cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Link to={`/admin/partners/${p.id}`} className="font-medium text-electric-300 text-sm truncate">{p.company_name}</Link>
                  <LeadScoreBadge score={p.lead_score} />
                </div>
                <div className="text-[11px] text-nf-text-muted truncate">{p.city || "—"}{p.category ? ` · ${p.category}` : ""}</div>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {p.rating && <span className="text-[10px] text-nf-text-muted">⭐ {p.rating} ({p.rating_count})</span>}
                  {s.sla_days != null && p.status_changed_at && (
                    <SlaWarningBadge updatedAt={p.status_changed_at} slaDays={s.sla_days} />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

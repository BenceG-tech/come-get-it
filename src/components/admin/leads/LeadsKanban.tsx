import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import LeadScoreBadge from "./LeadScoreBadge";

const STATUSES = [
  { key: "lead", label: "Új lead" },
  { key: "contacted", label: "Megkeresve" },
  { key: "negotiating", label: "Tárgyalás" },
  { key: "proposal_sent", label: "Ajánlat" },
  { key: "signed", label: "Aláírt" },
  { key: "rejected", label: "Elutasítva" },
];

export default function LeadsKanban({ partners, onStatusChange }: { partners: any[]; onStatusChange: (id: string, status: string) => void }) {
  const byStatus: Record<string, any[]> = {};
  STATUSES.forEach(s => byStatus[s.key] = []);
  partners.forEach(p => { (byStatus[p.status] ??= []).push(p); });

  const onDragStart = (e: React.DragEvent, id: string) => { e.dataTransfer.setData("text/plain", id); };
  const onDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) onStatusChange(id, status);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {STATUSES.map(s => (
        <div key={s.key} className="w-72 shrink-0" onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, s.key)}>
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="text-xs uppercase tracking-wider text-nf-text-muted font-semibold">{s.label}</div>
            <div className="text-xs text-nf-text-muted">{byStatus[s.key]?.length ?? 0}</div>
          </div>
          <div className="space-y-2 min-h-[200px] p-2 rounded-lg bg-nf-surface-alt/30">
            {(byStatus[s.key] ?? []).map(p => (
              <Card key={p.id} draggable onDragStart={(e) => onDragStart(e, p.id)}
                className="p-3 hover:border-electric-300/50 cursor-grab active:cursor-grabbing">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Link to={`/admin/partners/${p.id}`} className="font-medium text-electric-300 text-sm truncate">{p.company_name}</Link>
                  <LeadScoreBadge score={p.lead_score} />
                </div>
                <div className="text-[11px] text-nf-text-muted truncate">{p.city || "—"}{p.category ? ` · ${p.category}` : ""}</div>
                {p.rating && <div className="text-[10px] text-nf-text-muted mt-1">⭐ {p.rating} ({p.rating_count})</div>}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

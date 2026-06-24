import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LeadScoreBadge from "./LeadScoreBadge";
import SlaWarningBadge from "@/components/admin/crm/SlaWarningBadge";
import { trackEvent } from "@/lib/track";
import { Mail, MailOpen, MessageSquare, AlertTriangle, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Stage = { id?: string; key: string; label: string; sla_days: number | null; order_index: number };

const FALLBACK: Stage[] = [
  { key: "lead", label: "Új lead", sla_days: null, order_index: 0 },
  { key: "contacted", label: "Megkeresve", sla_days: null, order_index: 1 },
  { key: "negotiating", label: "Tárgyalás", sla_days: null, order_index: 2 },
  { key: "proposal_sent", label: "Ajánlat", sla_days: null, order_index: 3 },
  { key: "signed", label: "Aláírt", sla_days: null, order_index: 4 },
  { key: "rejected", label: "Elutasítva", sla_days: null, order_index: 5 },
];

type Engagement = { sent: number; opened: number; replied: number; failed: number };

import { getReadiness, READINESS_LABEL, type ReadinessLevel } from "@/lib/lead-readiness";

const READINESS_STAGES: Stage[] = [
  { key: "r0", label: "Nyers", sla_days: null, order_index: 0 },
  { key: "r1", label: "Kutatva", sla_days: null, order_index: 1 },
  { key: "r2", label: "Pontozva", sla_days: null, order_index: 2 },
  { key: "r3", label: "Értékelve", sla_days: null, order_index: 3 },
];

export default function LeadsKanban({ partners, onStatusChange, groupBy = "status", onCardClick }: { partners: any[]; onStatusChange: (id: string, status: string) => void; groupBy?: "status" | "readiness"; onCardClick?: (id: string) => void }) {
  const [stages, setStages] = useState<Stage[]>(FALLBACK);
  const [engagement, setEngagement] = useState<Record<string, Engagement>>({});
  const { toast } = useToast();

  const openIgDm = async (p: any) => {
    const handle = (p.instagram_handle || p.instagram || "").toString().replace(/^@/, "").trim();
    if (!handle) { toast({ title: "Nincs Instagram handle", variant: "destructive" }); return; }
    const msg = `Szia ${p.company_name}! Bence vagyok a Come Get It-ről 👋\n\nEgy ingyenes ital app-ot építünk magyar vendéglátóhelyeknek — minden user kap napi 1 üdvözlőitalt, ti meg új törzsvendégeket. Founding Partner program most még ingyen.\n\nÉrdekel egy 10 perces telefonos egyeztetés?\n\nhttps://come-get-it.app`;
    try { await navigator.clipboard.writeText(msg); toast({ title: "Üzenet vágólapra másolva", description: "Most nyitjuk az Instagramot — Ctrl+V + Enter" }); } catch { /* ignore */ }
    window.open(`https://ig.me/m/${handle}`, "_blank", "noopener");
    trackEvent("ig_dm_opened", { entity_type: "partner", entity_id: p.id });
  };

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

  // Load engagement aggregates for the visible partners
  useEffect(() => {
    if (!partners.length) return;
    (async () => {
      const ids = partners.map((p) => p.id);
      const { data: en } = await supabase
        .from("outreach_enrollments")
        .select("id, entity_id")
        .eq("entity_type", "partner")
        .in("entity_id", ids);
      const enrollmentToPartner = new Map<string, string>();
      (en ?? []).forEach((e: any) => enrollmentToPartner.set(e.id, e.entity_id));
      const enrollmentIds = Array.from(enrollmentToPartner.keys());
      if (!enrollmentIds.length) return;
      const { data: ev } = await supabase
        .from("outreach_events")
        .select("enrollment_id, status")
        .in("enrollment_id", enrollmentIds);
      const map: Record<string, Engagement> = {};
      (ev ?? []).forEach((e: any) => {
        const pid = enrollmentToPartner.get(e.enrollment_id);
        if (!pid) return;
        map[pid] ??= { sent: 0, opened: 0, replied: 0, failed: 0 };
        if (e.status === "sent") map[pid].sent++;
        else if (e.status === "opened") map[pid].opened++;
        else if (e.status === "replied") map[pid].replied++;
        else if (e.status === "failed" || e.status === "bounced") map[pid].failed++;
      });
      setEngagement(map);
    })();
  }, [partners]);

  const byReadiness = groupBy === "readiness";
  const activeStages = byReadiness ? READINESS_STAGES : stages;
  const byStatus: Record<string, any[]> = {};
  activeStages.forEach((s) => (byStatus[s.key] = []));
  partners.forEach((p) => {
    const key = byReadiness ? `r${getReadiness(p)}` : p.status;
    (byStatus[key] ??= []).push(p);
  });

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
      {activeStages.map((s) => (
        <div
          key={s.key}
          className="w-72 shrink-0"
          onDragOver={(e) => !byReadiness && e.preventDefault()}
          onDrop={(e) => !byReadiness && onDrop(e, s.key)}
        >
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="text-xs uppercase tracking-wider text-nf-text-muted font-semibold">{s.label}</div>
            <div className="text-xs text-nf-text-muted">{byStatus[s.key]?.length ?? 0}</div>
          </div>
          <div className="space-y-2 min-h-[200px] p-2 rounded-lg bg-nf-surface-alt/30">
            {(byStatus[s.key] ?? []).map((p) => {
              const eg = engagement[p.id];
              const weakSubject = eg && eg.sent >= 2 && eg.opened === 0;
              const badEmail = eg && eg.failed > 0;
              return (
                <Card
                  key={p.id}
                  draggable={!byReadiness}
                  onDragStart={(e) => !byReadiness && onDragStart(e, p.id, s.key)}
                  onClick={() => onCardClick?.(p.id)}
                  className={`p-3 hover:border-electric-300/50 ${byReadiness ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    {onCardClick ? (
                      <button className="font-medium text-electric-300 text-sm truncate text-left">{p.company_name}</button>
                    ) : (
                      <Link to={`/admin/partners/${p.id}`} className="font-medium text-electric-300 text-sm truncate">{p.company_name}</Link>
                    )}
                    <LeadScoreBadge score={p.lead_score} reasons={p.score_reasons} />
                  </div>
                  <div className="text-[11px] text-nf-text-muted truncate">{p.city || "—"}{p.category ? ` · ${p.category}` : ""}</div>
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    {p.rating && <span className="text-[10px] text-nf-text-muted">⭐ {p.rating} ({p.rating_count})</span>}
                    {s.sla_days != null && p.status_changed_at && (
                      <SlaWarningBadge updatedAt={p.status_changed_at} slaDays={s.sla_days} />
                    )}
                  </div>
                  {eg && (eg.sent + eg.opened + eg.replied + eg.failed > 0) && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-nf-border/40 text-[10px] text-nf-text-muted" title="Outreach: küldve / megnyitva / válasz / hiba">
                      <span className="flex items-center gap-0.5"><Mail className="w-3 h-3" />{eg.sent}</span>
                      <span className="flex items-center gap-0.5 text-electric-300"><MailOpen className="w-3 h-3" />{eg.opened}</span>
                      <span className="flex items-center gap-0.5 text-emerald-400"><MessageSquare className="w-3 h-3" />{eg.replied}</span>
                      {weakSubject && <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-[9px] px-1 py-0 h-4">gyenge subject</Badge>}
                      {badEmail && <Badge variant="outline" className="border-red-500/40 text-red-300 text-[9px] px-1 py-0 h-4 flex items-center gap-0.5"><AlertTriangle className="w-2.5 h-2.5" />rossz email</Badge>}
                    </div>
                  )}
                  {(p.instagram_handle || p.instagram) && (
                    <button
                      onClick={(e) => { e.stopPropagation(); openIgDm(p); }}
                      className="mt-2 w-full text-[10px] flex items-center justify-center gap-1 px-2 py-1 rounded border border-pink-500/40 text-pink-300 hover:bg-pink-500/10 transition"
                      title="Üzenet vágólapra + Instagram megnyitása"
                    >
                      <Instagram className="w-3 h-3" /> DM @{(p.instagram_handle || p.instagram).replace(/^@/, "").slice(0, 18)}
                    </button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

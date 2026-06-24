import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MailOpen, MessageSquare, AlertTriangle, Loader2, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FieldHelp from "@/components/admin/help/FieldHelp";

const DEAL_LABEL: Record<string, string> = {
  pending: "Függőben",
  accepted: "Elfogadva",
  rejected: "Elutasítva",
};

export default function PartnerOutreachHealth({ partnerId }: { partnerId: string }) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data: en } = await supabase
      .from("outreach_enrollments")
      .select("id, sequence_id, status, current_step, started_at, last_reply_at, reply_sentiment, founding_deal_status, outreach_sequences(name)")
      .eq("entity_type", "partner")
      .eq("entity_id", partnerId)
      .order("started_at", { ascending: false });
    const list = en ?? [];
    setEnrollments(list);
    if (list.length) {
      const ids = list.map((x: any) => x.id);
      const { data: ev } = await supabase
        .from("outreach_events")
        .select("enrollment_id, status, sent_at, subject, skipped_reason")
        .in("enrollment_id", ids)
        .order("sent_at", { ascending: false });
      setEvents(ev ?? []);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, [partnerId]);

  const setDealStatus = async (enrollmentId: string, status: string) => {
    setUpdating(enrollmentId);
    const { error } = await supabase.from("outreach_enrollments").update({ founding_deal_status: status }).eq("id", enrollmentId);
    setUpdating(null);
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    toast({ title: `Founding deal: ${DEAL_LABEL[status] ?? status}` });
    load();
  };

  const pauseEnrollment = async (id: string) => {
    await supabase.from("outreach_enrollments").update({ status: "paused", next_run_at: null }).eq("id", id);
    toast({ title: "Szekvencia szüneteltetve" });
    load();
  };

  const stats = (() => {
    const map = { sent: 0, opened: 0, replied: 0, failed: 0, skipped: 0 };
    for (const e of events) {
      if (e.status in map) (map as any)[e.status]++;
    }
    return map;
  })();

  if (loading) return <Card><CardContent className="p-4 flex items-center gap-2 text-sm text-nf-text-muted"><Loader2 className="w-4 h-4 animate-spin" /> Outreach health…</CardContent></Card>;
  if (!enrollments.length) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          Outreach health
          <FieldHelp text="A partnerhez kapcsolódó outreach futások állapota, engagement statisztikák és a founding deal manuális státusza." />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-nf-text-muted" /> {stats.sent} küldve</div>
          <div className="flex items-center gap-1 text-electric-300"><MailOpen className="w-3.5 h-3.5" /> {stats.opened} nyitás</div>
          <div className="flex items-center gap-1 text-emerald-400"><MessageSquare className="w-3.5 h-3.5" /> {stats.replied} válasz</div>
          {stats.failed > 0 && <div className="flex items-center gap-1 text-red-400"><AlertTriangle className="w-3.5 h-3.5" /> {stats.failed} hiba</div>}
          {stats.skipped > 0 && <div className="text-nf-text-muted">{stats.skipped} kihagyott (guardrail)</div>}
        </div>

        {enrollments.map((en) => (
          <div key={en.id} className="p-3 rounded-lg bg-nf-surface-alt/60 border border-nf-border/60 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="text-sm font-medium">{(en.outreach_sequences as any)?.name ?? "Szekvencia"}</div>
              <Badge variant={en.status === "active" ? "default" : "secondary"}>{en.status}</Badge>
            </div>
            <div className="text-[11px] text-nf-text-muted">
              Lépés {en.current_step + 1} · indítva {new Date(en.started_at).toLocaleDateString("hu-HU")}
              {en.last_reply_at && <> · válasz: {new Date(en.last_reply_at).toLocaleDateString("hu-HU")}</>}
              {en.reply_sentiment && <> · {en.reply_sentiment}</>}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-nf-text-muted">Founding deal:</span>
              {(["pending", "accepted", "rejected"] as const).map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={en.founding_deal_status === s ? "default" : "outline"}
                  className="h-6 text-[10px] px-2"
                  disabled={updating === en.id}
                  onClick={() => setDealStatus(en.id, s)}
                >
                  {DEAL_LABEL[s]}
                </Button>
              ))}
              {en.status === "active" && (
                <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2 ml-auto" onClick={() => pauseEnrollment(en.id)}>
                  <Pause className="w-3 h-3 mr-1" /> Szünet
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

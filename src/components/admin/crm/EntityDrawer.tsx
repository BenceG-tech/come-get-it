import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, ExternalLink, FileText, MessageSquare, Clock, ListChecks, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/track";
import SlaWarningBadge from "./SlaWarningBadge";
import PartnerHealthRadar from "./PartnerHealthRadar";

interface Props {
  entityType: "partner" | "lead";
  entityId: string | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export default function EntityDrawer({ entityType, entityId, open, onOpenChange }: Props) {
  const [entity, setEntity] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open || !entityId) return;
    trackEvent("entity_drawer_opened", { entity_type: entityType, entity_id: entityId });
    (async () => {
      setLoading(true);
      try {
        const [ent, trans, ints, oev, tk, enr, links] = await Promise.all([
          supabase.from("partners").select("*").eq("id", entityId).maybeSingle(),
          supabase.from("pipeline_transitions").select("*").eq("entity_id", entityId).order("created_at", { ascending: false }).limit(50),
          supabase.from("partner_interactions").select("*").eq("partner_id", entityId).order("created_at", { ascending: false }).limit(50),
          supabase.from("outreach_events").select("*, outreach_enrollments!inner(entity_id)").eq("outreach_enrollments.entity_id", entityId).order("created_at", { ascending: false }).limit(50),
          supabase.from("pipeline_tasks").select("*").eq("entity_id", entityId).order("due_at", { ascending: true }).limit(20),
          supabase.from("outreach_enrollments").select("*, outreach_sequences(name)").eq("entity_id", entityId).order("started_at", { ascending: false }).limit(20),
          supabase.from("document_entity_links").select("*, documents(id, title, category, ai_hook, lifecycle_status)").eq("entity_id", entityId).limit(20),
        ]);
        setEntity(ent.data);
        const merged = [
          ...(trans.data ?? []).map((t: any) => ({ type: "transition", at: t.created_at, label: `${t.from_stage_key ?? "—"} → ${t.to_stage_key}`, note: t.note })),
          ...(ints.data ?? []).map((i: any) => ({ type: "interaction", at: i.created_at, label: i.interaction_type, note: i.notes })),
          ...(oev.data ?? []).map((e: any) => ({ type: "outreach", at: e.created_at, label: e.event_type, note: e.metadata ? JSON.stringify(e.metadata).slice(0, 120) : null })),
        ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
        setTimeline(merged);
        setTasks(tk.data ?? []);
        setEnrollments(enr.data ?? []);
        setDocs(links.data ?? []);
        setAiSuggestion(null);
      } catch (e: any) {
        toast({ title: "Betöltés hiba", description: e?.message ?? String(e), variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [open, entityId, entityType, toast]);

  const requestAi = async () => {
    if (!entityId) return;
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("outreach-suggest", { body: { partner_id: entityId } });
      if (error) throw error;
      setAiSuggestion(typeof data === "string" ? data : (data?.suggestion ?? data?.message ?? JSON.stringify(data, null, 2)));
    } catch (e: any) {
      toast({ title: "AI hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto bg-nf-bg border-nf-border">
        <SheetHeader>
          <SheetTitle className="text-electric-300 flex items-center gap-2 flex-wrap">
            {entity?.company_name ?? "Betöltés…"}
            {entity?.lead_score != null && <Badge variant="outline">Score: {entity.lead_score}</Badge>}
            {entity?.status_changed_at && <SlaWarningBadge updatedAt={entity.status_changed_at} slaDays={7} />}
          </SheetTitle>
          <div className="text-xs text-nf-text-muted">{entity?.city} · {entity?.category} · {entity?.status}</div>
        </SheetHeader>

        {loading && <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-electric-300" /></div>}
        {!loading && entity && (
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="overview">Áttekintés</TabsTrigger>
              <TabsTrigger value="timeline"><Clock className="h-3 w-3" /></TabsTrigger>
              <TabsTrigger value="tasks"><ListChecks className="h-3 w-3" /></TabsTrigger>
              <TabsTrigger value="seq"><Send className="h-3 w-3" /></TabsTrigger>
              <TabsTrigger value="docs"><FileText className="h-3 w-3" /></TabsTrigger>
              <TabsTrigger value="ai"><Sparkles className="h-3 w-3" /></TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-3 mt-3">
              <Card className="p-3 text-sm space-y-1 bg-nf-surface border-nf-border">
                <div><b>Email:</b> {entity.email ?? "—"}</div>
                <div><b>Telefon:</b> {entity.phone ?? "—"}</div>
                <div><b>Kapcsolattartó:</b> {entity.contact_name ?? "—"}</div>
                <div><b>Notes:</b> {entity.notes ?? "—"}</div>
              </Card>
              {entityType === "partner" && entity && <PartnerHealthRadar partnerId={entityId!} />}
              <Link to={`/admin/partners/${entityId}`} className="inline-flex items-center gap-1 text-xs text-electric-300 hover:underline">
                <ExternalLink className="h-3 w-3" /> Teljes profil
              </Link>
            </TabsContent>

            <TabsContent value="timeline" className="mt-3">
              <div className="space-y-2">
                {timeline.length === 0 && <div className="text-xs text-nf-text-muted">Nincs esemény</div>}
                {timeline.map((e, i) => (
                  <Card key={i} className="p-2 text-xs bg-nf-surface border-nf-border">
                    <div className="flex justify-between gap-2">
                      <span className="font-semibold text-electric-300">{e.label}</span>
                      <span className="text-nf-text-muted">{new Date(e.at).toLocaleString("hu-HU")}</span>
                    </div>
                    {e.note && <div className="text-nf-text-muted mt-1">{e.note}</div>}
                    <div className="text-[10px] uppercase tracking-wider text-nf-text-muted mt-1">{e.type}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="mt-3 space-y-2">
              {tasks.length === 0 && <div className="text-xs text-nf-text-muted">Nincs teendő</div>}
              {tasks.map((t) => (
                <Card key={t.id} className="p-2 text-xs bg-nf-surface border-nf-border flex justify-between gap-2">
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-nf-text-muted">{t.due_at ? `Esedékes: ${new Date(t.due_at).toLocaleDateString("hu-HU")}` : ""} · {t.status}</div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="seq" className="mt-3 space-y-2">
              {enrollments.length === 0 && <div className="text-xs text-nf-text-muted">Nincs aktív sequence</div>}
              {enrollments.map((e) => (
                <Card key={e.id} className="p-2 text-xs bg-nf-surface border-nf-border">
                  <div className="font-semibold">{e.outreach_sequences?.name ?? "Sequence"}</div>
                  <div className="text-nf-text-muted">Lépés {e.current_step ?? 0} · {e.status}</div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="docs" className="mt-3 space-y-2">
              {docs.length === 0 && <div className="text-xs text-nf-text-muted">Nincs csatolt dokumentum</div>}
              {docs.map((l) => l.documents && (
                <Link key={l.id} to={`/admin/documents/${l.documents.id}`} className="block">
                  <Card className="p-2 text-xs bg-nf-surface border-nf-border hover:border-electric-300/60">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3 text-electric-300" />
                      <span className="font-semibold flex-1 truncate">{l.documents.title}</span>
                      {l.documents.lifecycle_status && <Badge variant="outline" className="text-[9px]">{l.documents.lifecycle_status}</Badge>}
                    </div>
                    {l.documents.ai_hook && <div className="text-nf-text-muted mt-1 line-clamp-2">{l.documents.ai_hook}</div>}
                  </Card>
                </Link>
              ))}
            </TabsContent>

            <TabsContent value="ai" className="mt-3 space-y-2">
              <Button variant="neon" size="sm" onClick={requestAi} disabled={aiLoading}>
                {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />} AI javaslat kérése
              </Button>
              {aiSuggestion && (
                <Card className="p-3 text-xs whitespace-pre-wrap bg-nf-surface border-nf-border">{aiSuggestion}</Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
}

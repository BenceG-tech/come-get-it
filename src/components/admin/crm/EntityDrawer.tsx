import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, ExternalLink, FileText, Clock, ListChecks, Send, Plus, Brain, Telescope, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { trackEvent } from "@/lib/track";
import SlaWarningBadge from "./SlaWarningBadge";
import PartnerHealthRadar from "./PartnerHealthRadar";
import SourceTimeline from "@/components/admin/SourceTimeline";
import LeadMockupGenerator from "@/components/admin/leads/LeadMockupGenerator";
import LeadOutreachModal from "@/components/admin/leads/LeadOutreachModal";
import InlineAIHelper from "@/components/admin/ai/InlineAIHelper";
import { Image as ImageIcon, Send as SendIcon } from "lucide-react";


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
  const [decisions, setDecisions] = useState<any[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiBrief, setAiBrief] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [briefLoading, setBriefLoading] = useState(false);
  const [researchLoading, setResearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [outreachOpen, setOutreachOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();


  const reload = async () => {
    if (!entityId) return;
    setLoading(true);
    try {
      const [ent, trans, ints, oev, tk, enr, links, dec] = await Promise.all([
        supabase.from("partners").select("*").eq("id", entityId).maybeSingle(),
        supabase.from("pipeline_transitions").select("*").eq("entity_id", entityId).order("created_at", { ascending: false }).limit(50),
        supabase.from("partner_interactions").select("*").eq("partner_id", entityId).order("created_at", { ascending: false }).limit(50),
        supabase.from("outreach_events").select("*, outreach_enrollments!inner(entity_id)").eq("outreach_enrollments.entity_id", entityId).order("created_at", { ascending: false }).limit(50),
        supabase.from("pipeline_tasks").select("*").eq("entity_id", entityId).order("due_at", { ascending: true }).limit(20),
        supabase.from("outreach_enrollments").select("*, outreach_sequences(name)").eq("entity_id", entityId).order("started_at", { ascending: false }).limit(20),
        supabase.from("document_entity_links").select("*, documents(id, title, category, ai_hook, lifecycle_status)").eq("entity_id", entityId).limit(20),
        supabase.from("decisions").select("id, decision_text, decided_at, review_at, outcome").eq("entity_id", entityId).order("decided_at", { ascending: false }).limit(10),
      ]);
      setEntity(ent.data);
      const merged = [
        ...(trans.data ?? []).map((t: any) => ({ type: "transition", at: t.created_at, label: `Stage váltás`, note: t.reason })),
        ...(ints.data ?? []).map((i: any) => ({ type: "interaction", at: i.created_at, label: `${i.channel} (${i.direction})`, note: i.summary })),
        ...(oev.data ?? []).map((e: any) => ({ type: "outreach", at: e.created_at, label: e.event_type, note: e.metadata ? JSON.stringify(e.metadata).slice(0, 120) : null })),
      ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
      setTimeline(merged);
      setTasks(tk.data ?? []);
      setEnrollments(enr.data ?? []);
      setDocs(links.data ?? []);
      setDecisions(dec.data ?? []);
    } catch (e: any) {
      toast({ title: "Betöltés hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !entityId) return;
    trackEvent("entity_drawer_opened", { entity_type: entityType, entity_id: entityId });
    setAiSuggestion(null);
    setAiBrief(null);
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, entityId, entityType]);

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

  const generateBrief = async () => {
    if (!entity) return;
    setBriefLoading(true);
    try {
      const ctx = {
        company: entity.company_name, city: entity.city, category: entity.category,
        status: entity.status, score: entity.lead_score, last_contact: entity.last_contact_at,
        recent_events: timeline.slice(0, 5),
        notes: entity.notes,
      };
      const { data, error } = await supabase.functions.invoke("admin-ai-chat", {
        body: {
          messages: [
            { role: "system", content: "Adj 3 mondatos magyar brief-et a partner/lead jelenlegi helyzetéről és egy konkrét javasolt következő lépést. Tömör, akcióközpontú." },
            { role: "user", content: JSON.stringify(ctx) },
          ],
        },
      });
      if (error) throw error;
      const text = data?.text ?? data?.message ?? data?.response ?? (typeof data === "string" ? data : JSON.stringify(data));
      setAiBrief(text);
      trackEvent("ai_brief_generated", { entity_type: entityType, entity_id: entityId! });
    } catch (e: any) {
      toast({ title: "AI brief hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setBriefLoading(false);
    }
  };

  const runResearch = async () => {
    if (!entityId) return;
    setResearchLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("lead-auto-research", { body: { partner_id: entityId } });
      if (error) throw error;
      trackEvent("lead_auto_research", { entity_type: entityType, entity_id: entityId, metadata: { hasLive: !!data?.hasLive } });
      toast({ title: "Kutatás kész", description: data?.hasLive ? "Élő web adattal" : "AI-only (nincs Firecrawl)" });
      await reload();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setResearchLoading(false);
    }
  };

  const quickTask = async () => {
    if (!entityId) return;
    const title = window.prompt("Új task címe:");
    if (!title) return;
    const due = new Date(Date.now() + 2 * 86400 * 1000).toISOString();
    const { error } = await supabase.from("pipeline_tasks").insert({ entity_id: entityId, entity_type: entityType, title, due_at: due, status: "pending" });
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    trackEvent("quick_action_used", { entity_type: entityType, entity_id: entityId, metadata: { action: "task" } });
    await reload();
  };

  const quickDecision = async () => {
    if (!entityId) return;
    const text = window.prompt("Mi a döntés? (1 mondat)");
    if (!text) return;
    const expected = window.prompt("Mit vársz tőle?") ?? "";
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from("decisions").insert({
      decision_text: text, expected_outcome: expected,
      entity_type: entityType, entity_id: entityId,
      created_by: auth.user?.id,
    });
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    trackEvent("decision_created", { entity_type: entityType, entity_id: entityId });
    toast({ title: "Döntés mentve" });
  };

  const research = entity?.research_notes as any;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "h-[100dvh] max-h-[100dvh] overflow-y-auto bg-nf-bg border-nf-border pb-32" : "w-full sm:max-w-2xl overflow-y-auto bg-nf-bg border-nf-border"}
      >

        <SheetHeader>

          <SheetTitle className="text-electric-300 flex items-center gap-2 flex-wrap">
            {entity?.company_name ?? "Betöltés…"}
            {entity?.lead_score != null && <Badge variant="outline">Score: {entity.lead_score}</Badge>}
            {entity?.status_changed_at && <SlaWarningBadge updatedAt={entity.status_changed_at} slaDays={7} />}
          </SheetTitle>
          <div className="text-xs text-nf-text-muted">{entity?.city} · {entity?.category} · {entity?.status}</div>
        </SheetHeader>

        {/* Quick Action Bar */}
        {entity && (
          <div className="flex flex-wrap gap-2 mt-3 pb-3 border-b border-nf-border">
            <Button size="sm" variant="neon" onClick={generateBrief} disabled={briefLoading}>
              {briefLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Zap className="w-3 h-3 mr-1" />} AI brief
            </Button>
            <Button size="sm" variant="outline" onClick={() => setOutreachOpen(true)}>
              <SendIcon className="w-3 h-3 mr-1" /> Outreach indítása
            </Button>
            <Button size="sm" variant="outline" onClick={runResearch} disabled={researchLoading}>
              {researchLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Telescope className="w-3 h-3 mr-1" />} Kutass utána
            </Button>
            <Button size="sm" variant="outline" onClick={quickTask}><Plus className="w-3 h-3 mr-1" /> Task</Button>
            <Button size="sm" variant="outline" onClick={quickDecision}><Brain className="w-3 h-3 mr-1" /> Döntés</Button>
            <InlineAIHelper
              context={{ partner: entity, recent_timeline: timeline.slice(0, 5), research: entity.research_dossier }}
              surface="partner drawer"
              suggestions={[
                "Mit írjak első emailben?",
                "Milyen kockázat van ezzel a leaddel?",
                "Mi a legjobb következő lépés?",
              ]}
            />
          </div>
        )}

        {aiBrief && (
          <Card className="p-3 mt-3 text-xs whitespace-pre-wrap bg-electric-300/5 border-electric-300/40">
            <div className="text-[10px] uppercase tracking-wider text-electric-300 mb-1">AI brief</div>
            {aiBrief}
          </Card>
        )}

        {loading && <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-electric-300" /></div>}
        {!loading && entity && (
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="overview">Áttekintés</TabsTrigger>
              <TabsTrigger value="timeline"><Clock className="h-3 w-3" /></TabsTrigger>
              <TabsTrigger value="tasks"><ListChecks className="h-3 w-3" /></TabsTrigger>
              <TabsTrigger value="seq"><Send className="h-3 w-3" /></TabsTrigger>
              <TabsTrigger value="docs"><FileText className="h-3 w-3" /></TabsTrigger>
              <TabsTrigger value="mockup"><ImageIcon className="h-3 w-3" /></TabsTrigger>
              <TabsTrigger value="ai"><Sparkles className="h-3 w-3" /></TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-3 mt-3">
              <Card className="p-3 text-sm space-y-1 bg-nf-surface border-nf-border">
                <div><b>Email:</b> {entity.email ?? "—"}</div>
                <div><b>Telefon:</b> {entity.phone ?? "—"}</div>
                <div><b>Kapcsolattartó:</b> {entity.contact_name ?? "—"}</div>
                <div><b>Notes:</b> {entity.notes ?? "—"}</div>
              </Card>

              {research && (
                <Card className="p-3 text-xs space-y-2 bg-nf-surface border-electric-300/30">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-wider text-electric-300 flex items-center gap-1">
                      <Telescope className="w-3 h-3" /> Auto-kutatás
                      {research._live_search === false && <Badge variant="outline" className="text-[9px]">AI-only</Badge>}
                    </div>
                    {research.opportunity_score != null && (
                      <Badge className="bg-electric-300/20 text-electric-300">Opportunity {research.opportunity_score}/100</Badge>
                    )}
                  </div>
                  {research.snapshot && <div className="text-nf-text-muted">{research.snapshot}</div>}
                  {Array.isArray(research.fit_reasons) && research.fit_reasons.length > 0 && (
                    <div><b className="text-electric-300">Fit:</b> {research.fit_reasons.join(" · ")}</div>
                  )}
                  {Array.isArray(research.risks) && research.risks.length > 0 && (
                    <div><b className="text-yellow-400">Risk:</b> {research.risks.join(" · ")}</div>
                  )}
                  {Array.isArray(research.talking_points) && research.talking_points.length > 0 && (
                    <div className="space-y-0.5 pt-1 border-t border-nf-border">
                      <b>Talking points:</b>
                      <ul className="list-disc list-inside text-nf-text-muted">{research.talking_points.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul>
                    </div>
                  )}
                  {research.next_action && <div className="pt-1 border-t border-nf-border"><b className="text-electric-300">Next:</b> {research.next_action}</div>}
                  {(research.sources || research._live_search) && (
                    <div className="pt-2 border-t border-nf-border">
                      <SourceTimeline
                        sources={Array.isArray(research.sources) ? research.sources : [
                          { url: entity.website, title: "Website scrape", scraped_at: research._researched_at },
                        ]}
                      />
                    </div>
                  )}
                </Card>
              )}


              {decisions.length > 0 && (
                <Card className="p-3 text-xs bg-nf-surface border-nf-border">
                  <div className="text-[10px] uppercase tracking-wider text-electric-300 flex items-center gap-1 mb-2">
                    <Brain className="w-3 h-3" /> Döntések ({decisions.length})
                  </div>
                  <div className="space-y-1.5">
                    {decisions.slice(0, 4).map((d: any) => {
                      const due = d.review_at && !d.outcome && new Date(d.review_at) <= new Date();
                      return (
                        <div key={d.id} className="flex items-start gap-2">
                          <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${d.outcome ? "bg-emerald-400" : due ? "bg-yellow-400" : "bg-electric-300"}`} />
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{d.decision_text}</div>
                            <div className="text-[10px] text-nf-text-muted">
                              {new Date(d.decided_at).toLocaleDateString("hu-HU")}
                              {d.outcome ? " · értékelve" : due ? " · esedékes" : ""}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

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

            <TabsContent value="mockup" className="mt-3">
              {entityId && <LeadMockupGenerator partnerId={entityId} />}
            </TabsContent>

            <TabsContent value="ai" className="mt-3 space-y-2">
              <Button variant="neon" size="sm" onClick={requestAi} disabled={aiLoading}>
                {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />} Outreach javaslat
              </Button>
              {aiSuggestion && (
                <Card className="p-3 text-xs whitespace-pre-wrap bg-nf-surface border-nf-border">{aiSuggestion}</Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
      <LeadOutreachModal
        partnerId={entityId}
        partnerName={entity?.company_name}
        open={outreachOpen}
        onOpenChange={setOutreachOpen}
        onDone={reload}
      />
    </Sheet>
  );
}

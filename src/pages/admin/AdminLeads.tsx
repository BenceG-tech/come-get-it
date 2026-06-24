import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Search, LayoutGrid, List, MapIcon, Telescope, Loader2, Zap, Bot, Mail, Phone, Instagram, Globe, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LeadScoreBadge from "@/components/admin/leads/LeadScoreBadge";
import BulkActionBar from "@/components/admin/leads/BulkActionBar";
import ImportWizard from "@/components/admin/leads/ImportWizard";
import EmailComposer from "@/components/admin/leads/EmailComposer";
import LeadsKanban from "@/components/admin/leads/LeadsKanban";
import LeadsMap from "@/components/admin/leads/LeadsMap";
import EntityDrawer from "@/components/admin/crm/EntityDrawer";
import PageIntro from "@/components/admin/help/PageIntro";
import ApifyScrapeModal from "@/components/admin/leads/ApifyScrapeModal";
import BulkOutreachModal from "@/components/admin/leads/BulkOutreachModal";
import BulkTagModal from "@/components/admin/leads/BulkTagModal";
import { exportRowsAsCsv } from "@/lib/export-csv";
import { trackEvent } from "@/lib/track";
import { useDragSelect } from "@/hooks/useDragSelect";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ReadinessPipelineBar from "@/components/admin/leads/ReadinessPipelineBar";
import ReadinessBadge from "@/components/admin/leads/ReadinessBadge";
import { getReadiness, getMissingStep, type ReadinessLevel } from "@/lib/lead-readiness";

const STATUS_LABEL: Record<string, string> = {
  lead: "Új lead", contacted: "Megkeresve", negotiating: "Tárgyalás", proposal_sent: "Ajánlat", signed: "Aláírt", rejected: "Elutasítva", paused: "Szünetel",
};

type View = "list" | "kanban" | "map";

export default function AdminLeads() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<View>("list");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [filterScore, setFilterScore] = useState("all");
  const [filterReadiness, setFilterReadiness] = useState<ReadinessLevel | "all">("all");
  const [kanbanGroup, setKanbanGroup] = useState<"status" | "readiness">("status");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showImport, setShowImport] = useState(false);
  const [showApify, setShowApify] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showOutreach, setShowOutreach] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [aiGrading, setAiGrading] = useState(false);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [researchingId, setResearchingId] = useState<string | null>(null);
  const [continuingId, setContinuingId] = useState<string | null>(null);
  const [bulkResearching, setBulkResearching] = useState(false);
  const [processingAll, setProcessingAll] = useState(false);
  const [continuingBulk, setContinuingBulk] = useState(false);
  const [busyLevel, setBusyLevel] = useState<ReadinessLevel | null>(null);
  const { toast } = useToast();

  const runAiGradeTop = async () => {
    setAiGrading(true);
    try {
      const { data, error } = await supabase.functions.invoke("lead-grade-ai-bulk", { body: { limit: 20 } });
      if (error) throw error;
      toast({ title: "AI értékelés kész", description: `${data?.updated ?? 0} lead értékelve` });
      await load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setAiGrading(false);
    }
  };

  const runResearch = async (id: string) => {
    setResearchingId(id);
    try {
      const { data, error } = await supabase.functions.invoke("lead-auto-research", { body: { partner_id: id } });
      if (error) throw error;
      trackEvent("lead_auto_research", { entity_type: "lead", entity_id: id, metadata: { hasLive: !!data?.hasLive } });
      toast({ title: "Kutatás kész", description: data?.hasLive ? "Élő web adattal" : "AI-only" });
      load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setResearchingId(null);
    }
  };

  const runStepForIds = async (step: "research" | "score" | "grade", ids: string[]) => {
    if (!ids.length) return { ok: 0 };
    if (step === "research") {
      const { data, error } = await supabase.functions.invoke("lead-bulk-research", { body: { partner_ids: ids } });
      if (error) throw error;
      return { ok: data?.done ?? ids.length };
    }
    if (step === "score") {
      const { data, error } = await supabase.functions.invoke("score-lead", { body: { partner_ids: ids } });
      if (error) throw error;
      return { ok: data?.queued ?? ids.length };
    }
    const { data, error } = await supabase.functions.invoke("lead-grade-ai-bulk", { body: { partner_ids: ids } });
    if (error) throw error;
    return { ok: data?.updated ?? ids.length };
  };

  const continueOne = async (id: string, step: "research" | "score" | "grade") => {
    setContinuingId(id);
    try {
      await runStepForIds(step, [id]);
      toast({ title: `${step === "research" ? "Kutatás" : step === "score" ? "Pontozás" : "Grade"} kész` });
      await load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setContinuingId(null);
    }
  };

  const processLevel = async (lvl: ReadinessLevel, ids: string[]) => {
    if (lvl === 3 || !ids.length) return;
    const step: "research" | "score" | "grade" = lvl === 0 ? "research" : lvl === 1 ? "score" : "grade";
    setBusyLevel(lvl);
    try {
      const { ok } = await runStepForIds(step, ids);
      toast({ title: `${ids.length} lead — ${step}`, description: `${ok} feldolgozva (háttérben is futhat)` });
      await load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setBusyLevel(null);
    }
  };

  const bulkContinueMissing = async () => {
    if (selected.size === 0) return;
    const sel = partners.filter((p) => selected.has(p.id));
    const groups: Record<"research" | "score" | "grade", string[]> = { research: [], score: [], grade: [] };
    sel.forEach((p) => {
      const m = getMissingStep(p);
      if (m) groups[m].push(p.id);
    });
    const todo = (["research", "score", "grade"] as const).filter((s) => groups[s].length);
    if (!todo.length) { toast({ title: "Minden kijelölt lead már értékelve" }); return; }
    setContinuingBulk(true);
    try {
      for (const s of todo) {
        await runStepForIds(s, groups[s]);
      }
      toast({ title: "Hiányzó lépések elindítva", description: todo.map((s) => `${s}: ${groups[s].length}`).join(" · ") });
      await load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setContinuingBulk(false);
    }
  };

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("partners").select("*").eq("type", "venue").order("lead_score", { ascending: false, nullsFirst: false }).limit(2000);
    setPartners(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const cities = useMemo(() => [...new Set(partners.map(p => p.city).filter(Boolean))].sort(), [partners]);

  const filtered = useMemo(() => partners.filter(p => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterCity !== "all" && p.city !== filterCity) return false;
    if (filterScore === "high" && (p.lead_score ?? 0) < 80) return false;
    if (filterScore === "mid" && ((p.lead_score ?? -1) < 50 || (p.lead_score ?? 101) >= 80)) return false;
    if (filterScore === "low" && (p.lead_score == null || p.lead_score >= 50)) return false;
    if (filterScore === "none" && p.lead_score != null) return false;
    if (filterReadiness !== "all" && getReadiness(p) !== filterReadiness) return false;
    if (search && !`${p.company_name} ${p.city} ${p.contact_name} ${p.email} ${p.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [partners, filterStatus, filterCity, filterScore, filterReadiness, search]);

  const stats = useMemo(() => ({
    total: partners.length,
    new: partners.filter(p => p.status === "lead").length,
    inProgress: partners.filter(p => ["contacted","negotiating","proposal_sent"].includes(p.status)).length,
    signed: partners.filter(p => p.status === "signed").length,
    hot: partners.filter(p => (p.lead_score ?? 0) >= 80).length,
  }), [partners]);

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const toggleAll = () => setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)));
  const filteredIds = useMemo(() => filtered.map(p => p.id), [filtered]);
  const dragSelect = useDragSelect({ ids: filteredIds, selected, setSelected });

  const bulkResearch = async () => {
    if (selected.size === 0) return;
    setBulkResearching(true);
    try {
      const ids = [...selected];
      const { data, error } = await supabase.functions.invoke("lead-bulk-research", { body: { partner_ids: ids } });
      if (error) throw error;
      toast({ title: "Bulk kutatás kész", description: `${data?.done ?? 0}/${ids.length} sikeres (${data?.failed ?? 0} hiba)` });
      await load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e.message, variant: "destructive" });
    } finally { setBulkResearching(false); }
  };

  const bulkGrade = async () => {
    if (selected.size === 0) return;
    setAiGrading(true);
    try {
      const { data, error } = await supabase.functions.invoke("lead-grade-ai-bulk", { body: { partner_ids: [...selected] } });
      if (error) throw error;
      toast({ title: "AI grade kész", description: `${data?.updated ?? 0} lead értékelve` });
      await load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e.message, variant: "destructive" });
    } finally { setAiGrading(false); }
  };

  const bulkScore = async () => {
    setScoring(true);
    try {
      const { data, error } = await supabase.functions.invoke("score-lead", { body: { partner_ids: [...selected] } });
      if (error) throw error;
      if (data?.status === "running_in_background") {
        toast({ title: "Score-olás háttérben fut", description: `${data.queued} lead — ~${Math.ceil(data.queued * 2 / 60)} perc múlva frissítsd az oldalt` });
      } else {
        toast({ title: `${selected.size} lead pontozva` });
      }
      await load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e.message, variant: "destructive" });
    } finally { setScoring(false); }
  };

  const bulkProcessAll = async () => {
    if (selected.size === 0) return;
    if (selected.size > 50 && !confirm(`${selected.size} lead teljes feldolgozása (Research + Score + Grade).\n\nEz kb. ${Math.ceil(selected.size / 10) * 60 / 60} perc és ~${selected.size * 3} AI hívás.\n\nFolytatod?`)) return;
    setProcessingAll(true);
    try {
      const { data, error } = await supabase.functions.invoke("lead-bulk-process", { body: { partner_ids: [...selected] } });
      if (error) throw error;
      toast({
        title: "Teljes pipeline elindult háttérben",
        description: `${data?.queued ?? selected.size} lead, ${data?.chunks ?? "?"} chunk — ~${Math.ceil((data?.eta_seconds ?? 60) / 60)} perc. Frissítsd később az oldalt.`,
      });
      setSelected(new Set());
    } catch (e: any) {
      toast({ title: "Hiba", description: e.message, variant: "destructive" });
    } finally { setProcessingAll(false); }
  };

  const bulkStatus = async (status: string) => {
    const { error } = await supabase.from("partners").update({ status: status as any }).in("id", [...selected]);
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    toast({ title: `${selected.size} lead státusza módosítva` });
    setSelected(new Set());
    await load();
  };

  const bulkDelete = async () => {
    if (!confirm(`Biztosan törölsz ${selected.size} leadet?`)) return;
    const { error } = await supabase.from("partners").delete().in("id", [...selected]);
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    toast({ title: `${selected.size} lead törölve` });
    setSelected(new Set());
    await load();
  };

  const onKanbanChange = async (id: string, status: string) => {
    await supabase.from("partners").update({ status: status as any }).eq("id", id);
    setPartners(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <PageIntro slug="leads" />
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold">Vendéglátóhely-leadek</h1>
          <p className="text-sm text-nf-text-muted">{filtered.length} / {partners.length} hely</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={() => setShowApify(true)} className="bg-electric-300 text-black hover:bg-electric-300/90">
            <Zap className="h-4 w-4" /> <span className="hidden sm:inline">Apify scrape</span>
          </Button>
          <Button size="sm" variant="outline" onClick={runAiGradeTop} disabled={aiGrading} title="A top 20 leadet (legmagasabb score) AI-vel A/B/C/D-re értékeli">
            {aiGrading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
            <span className="hidden sm:inline">{aiGrading ? "Értékel…" : "AI értékelés (top 20)"}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
            <Upload className="h-4 w-4" /> <span className="hidden sm:inline">Import</span>
          </Button>
          <Link to="/admin/partners"><Button variant="ghost" size="sm">Klasszikus nézet</Button></Link>
        </div>
      </div>


      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
        <Card className="p-3"><div className="text-2xl font-bold">{stats.total}</div><div className="text-[10px] uppercase text-nf-text-muted">Összes</div></Card>
        <Card className="p-3"><div className="text-2xl font-bold text-electric-300">{stats.new}</div><div className="text-[10px] uppercase text-nf-text-muted">Új</div></Card>
        <Card className="p-3"><div className="text-2xl font-bold text-amber-400">{stats.inProgress}</div><div className="text-[10px] uppercase text-nf-text-muted">Folyamatban</div></Card>
        <Card className="p-3"><div className="text-2xl font-bold text-green-400">{stats.signed}</div><div className="text-[10px] uppercase text-nf-text-muted">Aláírt</div></Card>
        <Card className="p-3"><div className="text-2xl font-bold text-electric-300">🔥 {stats.hot}</div><div className="text-[10px] uppercase text-nf-text-muted">Hot (80+)</div></Card>
      </div>

      {/* AI Pipeline Readiness */}
      <ReadinessPipelineBar
        partners={partners}
        activeLevel={filterReadiness}
        onSelectLevel={setFilterReadiness}
        onProcessLevel={(lvl, ids) => processLevel(lvl, ids)}
        busyLevel={busyLevel}
      />

      {/* View switcher */}
      <div className="flex gap-1 border-b border-nf-border">
        {[
          { v: "list", l: "Lista", I: List },
          { v: "kanban", l: "Kanban", I: LayoutGrid },
          { v: "map", l: "Térkép", I: MapIcon },
        ].map(({ v, l, I }) => (
          <button key={v} onClick={() => setView(v as View)}
            className={`px-4 py-2 text-sm flex items-center gap-2 border-b-2 -mb-px transition ${view === v ? "border-electric-300 text-electric-300" : "border-transparent text-nf-text-muted hover:text-white"}`}>
            <I className="h-4 w-4" /> {l}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nf-text-muted" />
          <Input placeholder="Keresés (név, város, email, kategória)…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm">
          <option value="all">Minden státusz</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm">
          <option value="all">Minden város</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterScore} onChange={(e) => setFilterScore(e.target.value)} className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm">
          <option value="all">Minden score</option>
          <option value="high">🔥 80+</option>
          <option value="mid">50-79</option>
          <option value="low">&lt; 50</option>
          <option value="none">Nincs pontozva</option>
        </select>
      </div>

      {/* Views */}
      {view === "list" && (
        <Card className="overflow-hidden select-none">
          <div className="px-3 py-2 text-[11px] text-nf-text-muted border-b border-nf-border bg-nf-surface-alt/20 flex items-center gap-3 flex-wrap">
            <span>💡 <b>Drag-select</b>: tartsd lenyomva az egeret és húzd át a sorokat. <b>Shift+klikk</b> = tartomány. <b>Klikk a névre</b> = részletek.</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-nf-text-muted border-b border-nf-border bg-nf-surface-alt/30">
                <tr>
                  <th className="p-3 w-8"><input type="checkbox" checked={selected.size > 0 && selected.size === filtered.length} onChange={toggleAll} /></th>
                  <th className="p-3">Hely · Kapcsolat</th>
                  <th className="p-3 hidden md:table-cell">Lokáció · Kategória</th>
                  <th className="p-3">Score / Grade</th>
                  <th className="p-3 hidden sm:table-cell">Google</th>
                  <th className="p-3">Elérhetőség</th>
                  <th className="p-3">Státusz</th>
                  <th className="p-3 w-24">AI</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const research = p.research_notes ?? p.research_dossier ?? null;
                  const hasEmail = !!p.email;
                  const hasPhone = !!p.phone;
                  const hasIg = !!(p.instagram_handle || p.instagram);
                  const hasSite = !!p.website;
                  return (
                  <tr
                    key={p.id}
                    onMouseEnter={() => dragSelect.onMouseEnter(p.id)}
                    className={`border-b border-nf-border hover:bg-nf-surface-alt/50 ${selected.has(p.id) ? "bg-electric-300/10" : ""}`}
                  >
                    <td className="p-3" onMouseDown={(e) => dragSelect.onMouseDown(p.id, e)}>
                      <input type="checkbox" readOnly checked={selected.has(p.id)} className="cursor-pointer" />
                    </td>
                    <td className="p-3">
                      <button onClick={() => setDrawerId(p.id)} className="text-electric-300 hover:underline font-medium text-left">{p.company_name}</button>
                      <div className="text-[11px] text-nf-text-muted flex items-center gap-2 flex-wrap">
                        {p.contact_name && <span>{p.contact_name}</span>}
                        {p.last_researched_at && <span className="text-emerald-400">✓ kutatva</span>}
                        {Array.isArray(p.tags) && p.tags.slice(0, 3).map((t: string) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-nf-surface-alt text-[9px]">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-nf-text-muted hidden md:table-cell text-xs">
                      <div>{p.city || "—"}</div>
                      <div className="text-[10px]">{p.category || "—"}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <LeadScoreBadge score={p.lead_score} />
                        {p.lead_grade && (
                          <span
                            title={p.lead_grade_source === 'ai' ? 'AI értékelés' : 'Auto (score alapján)'}
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${
                              p.lead_grade === 'A' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                              p.lead_grade === 'B' ? 'bg-electric-300/20 text-electric-300 border border-electric-300/40' :
                              p.lead_grade === 'C' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                              'bg-nf-surface-alt text-nf-text-muted border border-nf-border'
                            }`}
                          >{p.lead_grade}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-nf-text-muted hidden sm:table-cell text-xs">{p.google_rating ? `⭐ ${p.google_rating} (${p.google_reviews_count ?? 0})` : "—"}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Mail className={`w-3.5 h-3.5 ${hasEmail ? "text-emerald-400" : "text-nf-text-muted/30"}`} />
                        <Phone className={`w-3.5 h-3.5 ${hasPhone ? "text-emerald-400" : "text-nf-text-muted/30"}`} />
                        <Instagram className={`w-3.5 h-3.5 ${hasIg ? "text-emerald-400" : "text-nf-text-muted/30"}`} />
                        <Globe className={`w-3.5 h-3.5 ${hasSite ? "text-emerald-400" : "text-nf-text-muted/30"}`} />
                      </div>
                    </td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-electric-300/10 text-electric-300">{STATUS_LABEL[p.status]}</span></td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button size="sm" variant="ghost" title="AI Insight gyors-nézet" disabled={!research}>
                              <Sparkles className={`w-3 h-3 ${research ? "text-electric-300" : "text-nf-text-muted/40"}`} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-96 text-xs bg-nf-surface border-nf-border">
                            {research ? (
                              <div className="space-y-2">
                                <div className="font-semibold text-electric-300">{research.snapshot ?? "—"}</div>
                                {research.fit_reasons && (
                                  <div><b>Fit:</b> <span className="text-nf-text-muted">{(research.fit_reasons ?? []).join(" · ")}</span></div>
                                )}
                                {research.risks && research.risks.length > 0 && (
                                  <div><b>Risk:</b> <span className="text-amber-300">{research.risks.join(" · ")}</span></div>
                                )}
                                {research.next_action && (
                                  <div className="pt-1 border-t border-nf-border"><b>Next:</b> {research.next_action}</div>
                                )}
                              </div>
                            ) : <div className="text-nf-text-muted">Még nincs kutatás. Indítsd a 🔭 gombbal.</div>}
                          </PopoverContent>
                        </Popover>
                        <Button size="sm" variant="ghost" disabled={researchingId === p.id} onClick={() => runResearch(p.id)} title="AI mélykutatás">
                          {researchingId === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Telescope className="w-3 h-3" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );})}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="p-8 text-center text-nf-text-muted">
                    {loading ? "Töltés…" : "Nincs lead. Indíts egy Apify scrape-et a fenti gombbal."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {view === "kanban" && <LeadsKanban partners={filtered} onStatusChange={onKanbanChange} />}
      {view === "map" && <LeadsMap partners={filtered} />}

      <BulkActionBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
        onScore={bulkScore}
        onEmail={() => setShowEmail(true)}
        onStatus={bulkStatus}
        onDelete={bulkDelete}
        onTag={() => setShowTag(true)}
        onOutreach={() => setShowOutreach(true)}
        onExportCsv={() => {
          const rows = partners.filter((p) => selected.has(p.id));
          exportRowsAsCsv(rows, [
            { key: "company_name", label: "Cég" },
            { key: "city", label: "Város" },
            { key: "category", label: "Kategória" },
            { key: "contact_name", label: "Kapcsolat" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Telefon" },
            { key: "instagram", label: "Instagram" },
            { key: "status", label: "Státusz" },
            { key: "lead_score", label: "Score" },
            { key: "lead_grade", label: "Grade" },
            { key: "google_rating", label: "Google rating" },
          ], `leadek-${new Date().toISOString().slice(0,10)}.csv`);
        }}
        onResearch={bulkResearch}
        onGrade={bulkGrade}
        onProcessAll={bulkProcessAll}
        researching={bulkResearching}
        grading={aiGrading}
        processingAll={processingAll}
        loading={scoring}
      />

      {showImport && <ImportWizard onClose={() => setShowImport(false)} onDone={load} />}
      {showApify && <ApifyScrapeModal onClose={() => setShowApify(false)} onDone={load} />}
      {showEmail && <EmailComposer partnerIds={[...selected]} onClose={() => setShowEmail(false)} onDone={() => { setShowEmail(false); setSelected(new Set()); load(); }} />}
      <BulkOutreachModal partnerIds={[...selected]} open={showOutreach} onOpenChange={setShowOutreach} onDone={() => { setSelected(new Set()); load(); }} />
      <BulkTagModal partnerIds={[...selected]} open={showTag} onOpenChange={setShowTag} onDone={() => { setSelected(new Set()); load(); }} />
      <EntityDrawer entityType="lead" entityId={drawerId} open={!!drawerId} onOpenChange={(o) => !o && setDrawerId(null)} />
    </div>
  );
}

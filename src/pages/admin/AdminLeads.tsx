import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Search, LayoutGrid, List, MapIcon, Sparkles, Telescope, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LeadScoreBadge from "@/components/admin/leads/LeadScoreBadge";
import BulkActionBar from "@/components/admin/leads/BulkActionBar";
import ImportWizard from "@/components/admin/leads/ImportWizard";
import EmailComposer from "@/components/admin/leads/EmailComposer";
import LeadsKanban from "@/components/admin/leads/LeadsKanban";
import LeadsMap from "@/components/admin/leads/LeadsMap";
import EntityDrawer from "@/components/admin/crm/EntityDrawer";
import PageIntro from "@/components/admin/help/PageIntro";
import { trackEvent } from "@/lib/track";

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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showImport, setShowImport] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [researchingId, setResearchingId] = useState<string | null>(null);
  const { toast } = useToast();

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
    if (search && !`${p.company_name} ${p.city} ${p.contact_name} ${p.email} ${p.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [partners, filterStatus, filterCity, filterScore, search]);

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

  const bulkScore = async () => {
    setScoring(true);
    try {
      const { error } = await supabase.functions.invoke("score-lead", { body: { partner_ids: [...selected] } });
      if (error) throw error;
      toast({ title: `${selected.size} lead pontozva` });
      await load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e.message, variant: "destructive" });
    } finally { setScoring(false); }
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
        <div className="flex gap-2">
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
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-nf-text-muted border-b border-nf-border bg-nf-surface-alt/30">
                <tr>
                  <th className="p-3 w-8"><input type="checkbox" checked={selected.size > 0 && selected.size === filtered.length} onChange={toggleAll} /></th>
                  <th className="p-3">Hely</th>
                  <th className="p-3 hidden md:table-cell">Város</th>
                  <th className="p-3 hidden md:table-cell">Kategória</th>
                  <th className="p-3">Score</th>
                  <th className="p-3 hidden sm:table-cell">Rating</th>
                  <th className="p-3">Státusz</th>
                  <th className="p-3 w-20">Művelet</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className={`border-b border-nf-border hover:bg-nf-surface-alt/50 ${selected.has(p.id) ? "bg-electric-300/5" : ""}`}>
                    <td className="p-3"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} /></td>
                    <td className="p-3">
                      <button onClick={() => setDrawerId(p.id)} className="text-electric-300 hover:underline font-medium text-left">{p.company_name}</button>
                      {p.contact_name && <div className="text-[11px] text-nf-text-muted">{p.contact_name}</div>}
                      {p.last_researched_at && <div className="text-[10px] text-emerald-400">✓ kutatva</div>}
                    </td>
                    <td className="p-3 text-nf-text-muted hidden md:table-cell">{p.city || "—"}</td>
                    <td className="p-3 text-nf-text-muted hidden md:table-cell text-xs">{p.category || "—"}</td>
                    <td className="p-3"><LeadScoreBadge score={p.lead_score} /></td>
                    <td className="p-3 text-nf-text-muted hidden sm:table-cell text-xs">{p.rating ? `⭐ ${p.rating} (${p.rating_count ?? 0})` : "—"}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-electric-300/10 text-electric-300">{STATUS_LABEL[p.status]}</span></td>
                    <td className="p-3">
                      <Button size="sm" variant="ghost" disabled={researchingId === p.id} onClick={() => runResearch(p.id)} title="Auto-kutatás">
                        {researchingId === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Telescope className="w-3 h-3" />}
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="p-8 text-center text-nf-text-muted">
                    {loading ? "Töltés…" : "Nincs lead. Importálj egyet, vagy adj hozzá manuálisan a Partnerek oldalon."}
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
        loading={scoring}
      />

      {showImport && <ImportWizard onClose={() => setShowImport(false)} onDone={load} />}
      {showEmail && <EmailComposer partnerIds={[...selected]} onClose={() => setShowEmail(false)} onDone={() => { setShowEmail(false); setSelected(new Set()); load(); }} />}
      <EntityDrawer entityType="lead" entityId={drawerId} open={!!drawerId} onOpenChange={(o) => !o && setDrawerId(null)} />
    </div>
  );
}

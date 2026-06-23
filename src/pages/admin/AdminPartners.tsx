import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageIntro from "@/components/admin/help/PageIntro";
import InlineEditCell from "@/components/admin/crm/InlineEditCell";
import BulkActionBar from "@/components/admin/leads/BulkActionBar";
import BulkOutreachModal from "@/components/admin/leads/BulkOutreachModal";
import BulkTagModal from "@/components/admin/leads/BulkTagModal";
import { exportRowsAsCsv } from "@/lib/export-csv";

const STATUS_LABEL: Record<string, string> = {
  lead: "Lead", contacted: "Megkeresve", negotiating: "Tárgyalás", proposal_sent: "Ajánlat küldve", signed: "Aláírt", rejected: "Elutasítva", paused: "Szünetel",
};
const TYPE_LABEL: Record<string, string> = { venue: "Vendéglátóhely", drink_brand: "Italmárka", rewards_partner: "Rewards", other: "Egyéb" };

export default function AdminPartners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ company_name: "", type: "venue", city: "", contact_name: "", email: "", phone: "", instagram: "" });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showOutreach, setShowOutreach] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("partners").select("*").order("updated_at", { ascending: false });
    setPartners(data ?? []);
  };
  useEffect(() => { load(); }, []);

  // Auto-open new drawer via ?new=1 (from CommandPalette)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("new") === "1") setShowNew(true);
  }, []);

  const filtered = partners.filter((p) => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterType !== "all" && p.type !== filterType) return false;
    if (search && !`${p.company_name} ${p.city} ${p.contact_name} ${p.email}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const create = async () => {
    if (!form.company_name.trim()) return;
    const { error } = await supabase.from("partners").insert([form as any]);
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Partner hozzáadva" });
    setShowNew(false);
    setForm({ company_name: "", type: "venue", city: "", contact_name: "", email: "", phone: "", instagram: "" });
    load();
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const toggleAll = () => setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)));

  const bulkStatus = async (status: string) => {
    const { error } = await supabase.from("partners").update({ status: status as any }).in("id", [...selected]);
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    toast({ title: `${selected.size} partner státusza módosítva` });
    setSelected(new Set()); await load();
  };
  const bulkDelete = async () => {
    if (!confirm(`Biztosan törölsz ${selected.size} partnert?`)) return;
    const { error } = await supabase.from("partners").delete().in("id", [...selected]);
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    toast({ title: `${selected.size} partner törölve` });
    setSelected(new Set()); await load();
  };
  const exportCsv = () => {
    const rows = partners.filter((p) => selected.has(p.id));
    exportRowsAsCsv(rows, [
      { key: "company_name", label: "Cég" },
      { key: "type", label: "Típus" },
      { key: "city", label: "Város" },
      { key: "contact_name", label: "Kapcsolat" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Telefon" },
      { key: "instagram", label: "Instagram" },
      { key: "status", label: "Státusz" },
      { key: "next_followup_at", label: "Follow-up" },
      { key: "tags", label: "Címkék" },
    ], `partnerek-${new Date().toISOString().slice(0,10)}.csv`);
  };

  const updateRow = (id: string, patch: any) => setPartners((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <PageIntro slug="partners" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold">Partnerek</h1>
          <p className="text-sm text-nf-text-muted">{filtered.length} / {partners.length} partner</p>
        </div>
        <Button variant="neon" size="sm" onClick={() => setShowNew(!showNew)} className="shrink-0">
          <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Új partner</span>
        </Button>
      </div>

      {showNew && (
        <Card className="p-4 md:p-5 space-y-3 border-electric-300/40">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input placeholder="Cégnév *" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
            <select className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <Input placeholder="Város" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input placeholder="Kapcsolattartó" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input placeholder="Instagram" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowNew(false)}>Mégse</Button>
            <Button variant="neon" onClick={create}>Hozzáad</Button>
          </div>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nf-text-muted" />
          <Input placeholder="Keresés…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <select className="flex-1 sm:flex-none rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Minden típus</option>
            {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select className="flex-1 sm:flex-none rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Minden státusz</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* Mobile: card list */}
      <div className="md:hidden space-y-2">
        {filtered.map((p) => {
          const missing = !p.contact_name || !p.next_followup_at;
          return (
            <Card key={p.id} className="p-3 hover:border-electric-300/50">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <Link to={`/admin/partners/${p.id}`} className="font-medium text-electric-300 truncate flex items-center gap-1">
                    {missing && <AlertCircle className="h-3.5 w-3.5 text-amber-400" />}
                    {p.company_name}
                  </Link>
                  <div className="text-xs text-nf-text-muted truncate">
                    {TYPE_LABEL[p.type]}{p.city ? ` · ${p.city}` : ""}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-electric-300/10 text-electric-300 shrink-0">{STATUS_LABEL[p.status]}</span>
              </div>
              <div className="mt-2 text-xs flex flex-wrap gap-x-3 gap-y-1">
                <span>Kapcsolat: <InlineEditCell rowId={p.id} column="contact_name" value={p.contact_name} placeholder="kapcsolat…" onSaved={(v) => updateRow(p.id, { contact_name: v })} /></span>
                <span>Follow-up: <InlineEditCell rowId={p.id} column="next_followup_at" type="date" value={p.next_followup_at} placeholder="dátum…" display={(v) => v ? new Date(v).toLocaleDateString("hu-HU") : "—"} onSaved={(v) => updateRow(p.id, { next_followup_at: v })} /></span>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && <div className="p-8 text-center text-nf-text-muted text-sm">Nincs partner.</div>}
      </div>

      {/* Desktop: table */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-nf-text-muted border-b border-nf-border">
              <tr>
                <th className="p-3 w-8"><input type="checkbox" checked={selected.size > 0 && selected.size === filtered.length} onChange={toggleAll} /></th>
                <th className="p-3">Cég</th>
                <th className="p-3">Típus</th>
                <th className="p-3">Város</th>
                <th className="p-3">Kapcsolat</th>
                <th className="p-3">Státusz</th>
                <th className="p-3">Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const missing = !p.contact_name || !p.next_followup_at;
                return (
                  <tr key={p.id} className={`border-b border-nf-border hover:bg-nf-surface-alt/50 ${selected.has(p.id) ? "bg-electric-300/5" : ""}`}>
                    <td className="p-3"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} /></td>
                    <td className="p-3">
                      <Link className="text-electric-300 hover:underline inline-flex items-center gap-1" to={`/admin/partners/${p.id}`}>
                        {missing && <AlertCircle className="h-3.5 w-3.5 text-amber-400" aria-label="Hiányzó adat" />}
                        {p.company_name}
                      </Link>
                    </td>
                    <td className="p-3">{TYPE_LABEL[p.type]}</td>
                    <td className="p-3 text-nf-text-muted">{p.city || "—"}</td>
                    <td className="p-3">
                      <InlineEditCell rowId={p.id} column="contact_name" value={p.contact_name} placeholder="kapcsolat…" onSaved={(v) => updateRow(p.id, { contact_name: v })} />
                    </td>
                    <td className="p-3"><span className="px-2 py-1 rounded text-xs bg-electric-300/10 text-electric-300">{STATUS_LABEL[p.status]}</span></td>
                    <td className="p-3">
                      <InlineEditCell rowId={p.id} column="next_followup_at" type="date" value={p.next_followup_at} placeholder="dátum…" display={(v) => v ? new Date(v).toLocaleDateString("hu-HU") : "—"} onSaved={(v) => updateRow(p.id, { next_followup_at: v })} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-nf-text-muted">Nincs partner. Adj hozzá egyet vagy módosítsd a szűrőket.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <BulkActionBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
        showScore={false}
        onStatus={bulkStatus}
        onDelete={bulkDelete}
        onTag={() => setShowTag(true)}
        onOutreach={() => setShowOutreach(true)}
        onExportCsv={exportCsv}
      />

      <BulkOutreachModal partnerIds={[...selected]} open={showOutreach} onOpenChange={setShowOutreach} onDone={() => { setSelected(new Set()); load(); }} />
      <BulkTagModal partnerIds={[...selected]} open={showTag} onOpenChange={setShowTag} onDone={() => { setSelected(new Set()); load(); }} />
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("partners").select("*").order("updated_at", { ascending: false });
    setPartners(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const filtered = partners.filter((p) => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterType !== "all" && p.type !== filterType) return false;
    if (search && !`${p.company_name} ${p.city} ${p.contact_name} ${p.email}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const create = async () => {
    if (!form.company_name.trim()) return;
    const { error } = await supabase.from("partners").insert([form]);
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Partner hozzáadva" });
    setShowNew(false);
    setForm({ company_name: "", type: "venue", city: "", contact_name: "", email: "", phone: "", instagram: "" });
    load();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Partnerek</h1>
          <p className="text-nf-text-muted">{filtered.length} / {partners.length} partner</p>
        </div>
        <Button variant="neon" onClick={() => setShowNew(!showNew)}><Plus className="h-4 w-4" /> Új partner</Button>
      </div>

      {showNew && (
        <Card className="p-5 space-y-3 border-electric-300/40">
          <div className="grid md:grid-cols-2 gap-3">
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

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nf-text-muted" />
          <Input placeholder="Keresés…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">Minden típus</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">Minden státusz</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-nf-text-muted border-b border-nf-border">
              <tr><th className="p-3">Cég</th><th className="p-3">Típus</th><th className="p-3">Város</th><th className="p-3">Kapcsolat</th><th className="p-3">Státusz</th><th className="p-3">Follow-up</th></tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-nf-border hover:bg-nf-surface-alt/50">
                  <td className="p-3"><Link className="text-electric-300 hover:underline" to={`/admin/partners/${p.id}`}>{p.company_name}</Link></td>
                  <td className="p-3">{TYPE_LABEL[p.type]}</td>
                  <td className="p-3 text-nf-text-muted">{p.city || "—"}</td>
                  <td className="p-3 text-nf-text-muted">{p.contact_name || p.email || "—"}</td>
                  <td className="p-3"><span className="px-2 py-1 rounded text-xs bg-electric-300/10 text-electric-300">{STATUS_LABEL[p.status]}</span></td>
                  <td className="p-3 text-nf-text-muted">{p.next_followup_at ? new Date(p.next_followup_at).toLocaleDateString("hu-HU") : "—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-nf-text-muted">Nincs partner. Adj hozzá egyet vagy módosítsd a szűrőket.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATUSES = ["lead", "contacted", "negotiating", "proposal_sent", "signed", "rejected", "paused"];
const CHANNELS = ["email", "instagram_dm", "phone", "in_person", "whatsapp", "other"];
const TYPES = ["venue", "drink_brand", "rewards_partner", "other"];

export default function AdminPartnerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [partner, setPartner] = useState<any>(null);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [docsSent, setDocsSent] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [newInter, setNewInter] = useState({ channel: "email", direction: "outbound", summary: "", full_content: "" });
  const [sendDocId, setSendDocId] = useState("");

  const load = async () => {
    const [p, i, d, allDocs] = await Promise.all([
      supabase.from("partners").select("*").eq("id", id).maybeSingle(),
      supabase.from("partner_interactions").select("*").eq("partner_id", id).order("occurred_at", { ascending: false }),
      supabase.from("partner_documents_sent").select("*, documents(title, category)").eq("partner_id", id).order("sent_at", { ascending: false }),
      supabase.from("documents").select("id, title, category"),
    ]);
    setPartner(p.data);
    setInteractions(i.data ?? []);
    setDocsSent(d.data ?? []);
    setDocuments(allDocs.data ?? []);
  };
  useEffect(() => { load(); }, [id]);

  const save = async () => {
    const { id: _, created_at, updated_at, created_by, ...rest } = partner;
    const { error } = await supabase.from("partners").update(rest).eq("id", id);
    if (error) toast({ title: "Hiba", description: error.message, variant: "destructive" });
    else toast({ title: "Mentve" });
  };

  const addInteraction = async () => {
    if (!newInter.summary.trim()) return;
    const { error } = await supabase.from("partner_interactions").insert([{ ...newInter, partner_id: id } as any]);
    if (error) toast({ title: "Hiba", description: error.message, variant: "destructive" });
    else { setNewInter({ channel: "email", direction: "outbound", summary: "", full_content: "" }); load(); }
  };

  const sendDoc = async () => {
    if (!sendDocId) return;
    const { error } = await supabase.from("partner_documents_sent").insert([{ partner_id: id, document_id: sendDocId, channel: "email" }]);
    if (error) toast({ title: "Hiba", description: error.message, variant: "destructive" });
    else { setSendDocId(""); load(); toast({ title: "Logolva" }); }
  };

  const remove = async () => {
    if (!confirm("Biztosan törlöd a partnert?")) return;
    await supabase.from("partners").delete().eq("id", id);
    navigate("/admin/partners");
  };

  if (!partner) return <div className="p-8 text-nf-text-muted">Betöltés…</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/admin/partners" className="flex items-center gap-2 text-nf-text-muted hover:text-white text-sm"><ArrowLeft className="h-4 w-4" /> Vissza</Link>
        <div className="flex gap-2">
          <Button variant="outline" onClick={remove}><Trash2 className="h-4 w-4" /> Törlés</Button>
          <Button variant="neon" onClick={save}><Save className="h-4 w-4" /> Mentés</Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>{partner.company_name}</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          <Input value={partner.company_name} onChange={(e) => setPartner({ ...partner, company_name: e.target.value })} placeholder="Cégnév" />
          <select className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={partner.type} onChange={(e) => setPartner({ ...partner, type: e.target.value })}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <Input value={partner.city ?? ""} onChange={(e) => setPartner({ ...partner, city: e.target.value })} placeholder="Város" />
          <Input value={partner.contact_name ?? ""} onChange={(e) => setPartner({ ...partner, contact_name: e.target.value })} placeholder="Kapcsolattartó" />
          <Input value={partner.email ?? ""} onChange={(e) => setPartner({ ...partner, email: e.target.value })} placeholder="Email" />
          <Input value={partner.phone ?? ""} onChange={(e) => setPartner({ ...partner, phone: e.target.value })} placeholder="Telefon" />
          <Input value={partner.instagram ?? ""} onChange={(e) => setPartner({ ...partner, instagram: e.target.value })} placeholder="Instagram" />
          <Input value={partner.website ?? ""} onChange={(e) => setPartner({ ...partner, website: e.target.value })} placeholder="Website" />
          <select className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={partner.status} onChange={(e) => setPartner({ ...partner, status: e.target.value })}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Input type="date" value={partner.next_followup_at ? partner.next_followup_at.slice(0, 10) : ""} onChange={(e) => setPartner({ ...partner, next_followup_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
          <Textarea className="md:col-span-2" rows={3} value={partner.notes ?? ""} onChange={(e) => setPartner({ ...partner, notes: e.target.value })} placeholder="Jegyzetek" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Új interakció</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <select className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={newInter.channel} onChange={(e) => setNewInter({ ...newInter, channel: e.target.value })}>
              {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={newInter.direction} onChange={(e) => setNewInter({ ...newInter, direction: e.target.value })}>
              <option value="outbound">kimenő</option><option value="inbound">bejövő</option>
            </select>
          </div>
          <Input placeholder="Rövid összefoglaló *" value={newInter.summary} onChange={(e) => setNewInter({ ...newInter, summary: e.target.value })} />
          <Textarea rows={4} placeholder="Teljes szöveg (opcionális)" value={newInter.full_content} onChange={(e) => setNewInter({ ...newInter, full_content: e.target.value })} />
          <Button variant="neon" onClick={addInteraction}>Hozzáad</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Kommunikációs napló ({interactions.length})</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {interactions.length === 0 && <div className="text-nf-text-muted text-sm">Még nincs bejegyzés.</div>}
          {interactions.map((i) => (
            <div key={i.id} className="p-3 rounded-lg bg-nf-surface-alt">
              <div className="flex justify-between text-xs text-nf-text-muted mb-1">
                <span>{i.channel} · {i.direction}</span>
                <span>{new Date(i.occurred_at).toLocaleString("hu-HU")}</span>
              </div>
              <div className="font-medium">{i.summary}</div>
              {i.full_content && <div className="text-sm text-nf-text-muted mt-2 whitespace-pre-wrap">{i.full_content}</div>}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Küldött dokumentumok</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <select className="flex-1 rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={sendDocId} onChange={(e) => setSendDocId(e.target.value)}>
              <option value="">Válassz dokumentumot…</option>
              {documents.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
            <Button variant="neon" onClick={sendDoc} disabled={!sendDocId}>Logolás</Button>
          </div>
          {docsSent.map((d) => (
            <div key={d.id} className="p-3 rounded-lg bg-nf-surface-alt flex justify-between text-sm">
              <span>{d.documents?.title}</span>
              <span className="text-nf-text-muted">{new Date(d.sent_at).toLocaleDateString("hu-HU")}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

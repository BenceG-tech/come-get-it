import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { v: "one_pager_venue", l: "1-pager vendéglátóhely" },
  { v: "long_pitch_venue", l: "Hosszú pitch vendéglátóhely" },
  { v: "drink_brand_deck", l: "Italmárka deck" },
  { v: "rewards_onboarding", l: "Rewards onboarding" },
  { v: "email_template", l: "Email sablon" },
  { v: "social_post", l: "Poszt szöveg" },
  { v: "ai_generated", l: "AI által generált" },
  { v: "other", l: "Egyéb" },
];

export default function AdminDocuments() {
  const [docs, setDocs] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", category: "one_pager_venue", description: "", when_to_use: "", content: "", storage_path: "" });
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
    setDocs(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const filtered = filter === "all" ? docs : docs.filter((d) => d.category === filter);

  const create = async () => {
    if (!form.title.trim()) return;
    const { error } = await supabase.from("documents").insert([form]);
    if (error) toast({ title: "Hiba", description: error.message, variant: "destructive" });
    else { setShowNew(false); setForm({ title: "", category: "one_pager_venue", description: "", when_to_use: "", content: "", storage_path: "" }); load(); toast({ title: "Mentve" }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Törlöd?")) return;
    await supabase.from("documents").delete().eq("id", id);
    load();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dokumentumok</h1>
          <p className="text-nf-text-muted">{docs.length} doksi · sablonok, pitch deckek, AI-anyagok</p>
        </div>
        <Button variant="neon" onClick={() => setShowNew(!showNew)}><Plus className="h-4 w-4" /> Új doksi</Button>
      </div>

      {showNew && (
        <Card className="p-5 space-y-3 border-electric-300/40">
          <Input placeholder="Cím *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select className="w-full rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
          </select>
          <Input placeholder="Rövid leírás" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder={'Mikor használd? (pl. „első kontakt kávézóknál")'} value={form.when_to_use} onChange={(e) => setForm({ ...form, when_to_use: e.target.value })} />
          <Input placeholder="Külső link a fájlhoz (pl. Google Drive)" value={form.storage_path} onChange={(e) => setForm({ ...form, storage_path: e.target.value })} />
          <Textarea rows={6} placeholder="Szöveges tartalom (email/poszt sablon, vagy a doksi szövege)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowNew(false)}>Mégse</Button>
            <Button variant="neon" onClick={create}>Mentés</Button>
          </div>
        </Card>
      )}

      <select className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Minden kategória</option>
        {CATEGORIES.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
      </select>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((d) => (
          <Card key={d.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg">{d.title}</CardTitle>
                <div className="text-xs text-electric-300 mt-1">{CATEGORIES.find((c) => c.v === d.category)?.l}</div>
              </div>
              <button onClick={() => remove(d.id)} className="text-nf-text-muted hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {d.description && <div className="text-nf-text-muted">{d.description}</div>}
              {d.when_to_use && <div><span className="text-electric-300">Mikor:</span> {d.when_to_use}</div>}
              {d.storage_path && <a href={d.storage_path} target="_blank" rel="noopener" className="text-electric-300 hover:underline block">Fájl megnyitása →</a>}
              {d.content && <details className="text-nf-text-muted"><summary className="cursor-pointer">Tartalom</summary><pre className="whitespace-pre-wrap mt-2 text-xs">{d.content}</pre></details>}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <div className="md:col-span-2 text-center text-nf-text-muted py-12">Nincs dokumentum.</div>}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATUSES = ["idea", "draft", "ready", "posted", "cancelled"];

export default function AdminCalendar() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ scheduled_date: new Date().toISOString().slice(0, 10), channel: "instagram", type: "post", title: "", content_draft: "", hashtags: "", status: "idea" });
  const [show, setShow] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("marketing_calendar").select("*").order("scheduled_date", { ascending: true });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title.trim()) return;
    const { error } = await supabase.from("marketing_calendar").insert([form]);
    if (error) toast({ title: "Hiba", description: error.message, variant: "destructive" });
    else { setShow(false); setForm({ scheduled_date: new Date().toISOString().slice(0, 10), channel: "instagram", type: "post", title: "", content_draft: "", hashtags: "", status: "idea" }); load(); }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("marketing_calendar").update({ status }).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Törlöd?")) return;
    await supabase.from("marketing_calendar").delete().eq("id", id);
    load();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketing naptár</h1>
          <p className="text-nf-text-muted">{items.length} tervezett bejegyzés</p>
        </div>
        <Button variant="neon" onClick={() => setShow(!show)}><Plus className="h-4 w-4" /> Új bejegyzés</Button>
      </div>

      {show && (
        <Card className="p-5 space-y-3 border-electric-300/40">
          <div className="grid md:grid-cols-3 gap-3">
            <Input type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} />
            <select className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
              <option value="instagram">Instagram</option><option value="facebook">Facebook</option><option value="email">Email</option><option value="tiktok">TikTok</option><option value="other">Egyéb</option>
            </select>
            <select className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="post">Poszt</option><option value="story">Story</option><option value="reel">Reel</option><option value="campaign">Kampány</option><option value="outreach">Outreach hullám</option>
            </select>
          </div>
          <Input placeholder="Cím *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea rows={4} placeholder="Tartalom draft" value={form.content_draft} onChange={(e) => setForm({ ...form, content_draft: e.target.value })} />
          <Input placeholder="Hashtagek" value={form.hashtags} onChange={(e) => setForm({ ...form, hashtags: e.target.value })} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShow(false)}>Mégse</Button>
            <Button variant="neon" onClick={create}>Mentés</Button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {items.map((it) => (
          <Card key={it.id}>
            <CardHeader className="flex flex-row justify-between items-start pb-2">
              <div>
                <div className="text-xs text-electric-300">{new Date(it.scheduled_date).toLocaleDateString("hu-HU")} · {it.channel} · {it.type}</div>
                <CardTitle className="text-lg mt-1">{it.title}</CardTitle>
              </div>
              <div className="flex gap-2 items-center">
                <select className="rounded bg-nf-surface-alt border border-nf-border px-2 h-8 text-xs" value={it.status} onChange={(e) => updateStatus(it.id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => remove(it.id)} className="text-nf-text-muted hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
              </div>
            </CardHeader>
            {(it.content_draft || it.hashtags) && (
              <CardContent className="text-sm space-y-2">
                {it.content_draft && <div className="whitespace-pre-wrap text-nf-text-muted">{it.content_draft}</div>}
                {it.hashtags && <div className="text-electric-300 text-xs">{it.hashtags}</div>}
              </CardContent>
            )}
          </Card>
        ))}
        {items.length === 0 && <div className="text-center text-nf-text-muted py-12">Nincs bejegyzés. Kérdezd meg az AI asszisztenst, csinál egy heti tervet.</div>}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Wand2, Loader2, CheckCircle2, FileText, Calendar } from "lucide-react";
import { trackEvent } from "@/lib/track";

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const CHANNELS = ["instagram", "facebook", "linkedin", "email", "blog", "tiktok"];

function toChannelArray(v: any): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
  if (typeof v === "string") return v ? [v] : [];
  if (v && typeof v === "object") return Object.values(v).filter((x): x is string => typeof x === "string");
  return [];
}
const STATUSES = [
  { key: "draft", label: "Vázlat", color: "bg-nf-surface-alt text-nf-text-muted border-nf-border" },
  { key: "approved", label: "Jóváhagyva", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
  { key: "in_production", label: "Folyamatban", color: "bg-amber-500/15 text-amber-300 border-amber-500/40" },
  { key: "published", label: "Publikálva", color: "bg-electric-300/15 text-electric-300 border-electric-300/40" },
  { key: "archived", label: "Archív", color: "bg-nf-surface-alt text-nf-text-muted/60 border-nf-border" },
];

const EMPTY = {
  title: "", angle: "", target_audience: "", cta: "", tone: "",
  channel_mix: ["instagram"] as string[],
  key_points: [""] as string[],
  status: "draft",
  scheduled_for: null as string | null,
};

export default function BriefsManager() {
  const { toast } = useToast();
  const [briefs, setBriefs] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [busy, setBusy] = useState<string | null>(null);
  const [posts, setPosts] = useState<{ briefId: string; data: any } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const load = async () => {
    const { data } = await supabase.from("content_briefs").select("*").order("created_at", { ascending: false });
    setBriefs(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditId(null); setForm({ ...EMPTY }); setShow(true); };
  const openEdit = (b: any) => {
    setEditId(b.id);
    setForm({
      title: b.title ?? "",
      angle: b.angle ?? "",
      target_audience: b.target_audience ?? "",
      cta: b.cta ?? "",
      tone: b.tone ?? "",
      channel_mix: toChannelArray(b.channel_mix),
      key_points: b.key_points ?? [""],
      status: b.status ?? "draft",
      scheduled_for: b.scheduled_for ?? null,
    });
    setShow(true);
  };

  const save = async () => {
    if (!form.title.trim()) { toast({ title: "Cím kötelező", variant: "destructive" }); return; }
    const payload: any = {
      ...form,
      key_points: form.key_points.filter(Boolean),
      scheduled_for: form.scheduled_for || null,
    };
    if (editId) {
      const { error } = await supabase.from("content_briefs").update(payload).eq("id", editId);
      if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Mentve" });
    } else {
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase.from("content_briefs").insert({ ...payload, created_by: auth.user?.id }).select("id").maybeSingle();
      if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
      await trackEvent("brief_created", { entity_type: "content_brief", entity_id: data?.id });
      toast({ title: "Brief létrehozva" });
    }
    setShow(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Törlöd a briefet?")) return;
    await supabase.from("content_briefs").delete().eq("id", id);
    load();
  };

  const setStatus = async (id: string, status: string) => {
    await supabase.from("content_briefs").update({ status }).eq("id", id);
    if (status === "approved") await trackEvent("brief_approved", { entity_type: "content_brief", entity_id: id });
    load();
  };

  const generatePosts = async (briefId: string) => {
    setBusy(briefId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${FUNCTIONS_URL}/brief-to-posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ brief_id: briefId }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Hiba");
      await trackEvent("brief_to_posts_generated", { entity_type: "content_brief", entity_id: briefId, value: j.posts?.length ?? 0 });
      setPosts({ briefId, data: j });
      load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message, variant: "destructive" });
    } finally { setBusy(null); }
  };

  const scheduleToCalendar = async (post: any, briefId: string) => {
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const { error } = await supabase.from("marketing_calendar").insert({
      scheduled_date: tomorrow.toISOString().slice(0, 10),
      scheduled_time: "18:00",
      channel: post.channel,
      type: "post",
      title: post.text?.slice(0, 60) ?? "Új poszt",
      content_draft: post.text + (post.hashtags ? `\n\n${post.hashtags}` : ""),
      hashtags: post.hashtags ?? null,
      status: "draft",
      brief_id: briefId,
    } as any);
    if (error) toast({ title: "Hiba", description: error.message, variant: "destructive" });
    else toast({ title: "Naptárba mentve" });
  };

  const filtered = statusFilter === "all" ? briefs : briefs.filter((b) => b.status === statusFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setStatusFilter("all")} className={`px-3 py-1 rounded-full text-xs border ${statusFilter === "all" ? "bg-electric-300/15 border-electric-300/50 text-electric-300" : "border-nf-border text-nf-text-muted"}`}>Mind ({briefs.length})</button>
          {STATUSES.map((s) => {
            const count = briefs.filter((b) => b.status === s.key).length;
            return (
              <button key={s.key} onClick={() => setStatusFilter(s.key)} className={`px-3 py-1 rounded-full text-xs border ${statusFilter === s.key ? "bg-electric-300/15 border-electric-300/50 text-electric-300" : "border-nf-border text-nf-text-muted"}`}>
                {s.label} ({count})
              </button>
            );
          })}
        </div>
        <Button variant="neon" size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Új brief</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((b) => {
          const statusDef = STATUSES.find((s) => s.key === b.status) ?? STATUSES[0];
          return (
            <Card key={b.id} className="hover:border-electric-300/40 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm">{b.title}</CardTitle>
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wide ${statusDef.color}`}>{statusDef.label}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {toChannelArray(b.channel_mix).map((c: string) => (
                    <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-nf-surface-alt text-nf-text-muted border border-nf-border">{c}</span>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {b.angle && <p className="text-nf-text-muted">{b.angle}</p>}
                {b.target_audience && <p className="text-nf-text-muted"><span className="text-electric-300">Persona:</span> {b.target_audience}</p>}
                {b.cta && <p className="text-nf-text-muted"><span className="text-electric-300">CTA:</span> {b.cta}</p>}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {b.status !== "approved" && (
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setStatus(b.id, "approved")}>
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Jóváhagy
                    </Button>
                  )}
                  <Button size="sm" variant="neon" className="h-7 text-xs" onClick={() => generatePosts(b.id)} disabled={busy === b.id}>
                    {busy === b.id ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Wand2 className="h-3 w-3 mr-1" />}
                    Posztok generálása
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => openEdit(b)}>Szerkeszt</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-red-400" onClick={() => remove(b.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="md:col-span-2 text-center text-nf-text-muted py-12 text-sm">
            Nincs brief. Hozz létre egyet, vagy használd az AI brief-ajánlót.
          </div>
        )}
      </div>

      {/* Edit/Create dialog */}
      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "Brief szerkesztése" : "Új brief"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-nf-text-muted">Cím *</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-nf-surface-alt border-nf-border mt-1" />
            </div>
            <div>
              <label className="text-xs text-nf-text-muted">Szögezés / angle</label>
              <Textarea rows={2} value={form.angle} onChange={(e) => setForm({ ...form, angle: e.target.value })} className="bg-nf-surface-alt border-nf-border mt-1" />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-nf-text-muted">Célközönség</label>
                <Input value={form.target_audience} onChange={(e) => setForm({ ...form, target_audience: e.target.value })} className="bg-nf-surface-alt border-nf-border mt-1" />
              </div>
              <div>
                <label className="text-xs text-nf-text-muted">CTA</label>
                <Input value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} className="bg-nf-surface-alt border-nf-border mt-1" />
              </div>
            </div>
            <div>
              <label className="text-xs text-nf-text-muted">Hangnem</label>
              <Input value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })} placeholder="pl. energikus, baráti, pattern-interrupt" className="bg-nf-surface-alt border-nf-border mt-1" />
            </div>
            <div>
              <label className="text-xs text-nf-text-muted block mb-2">Csatorna mix</label>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map((c) => (
                  <button key={c} type="button" onClick={() => setForm({ ...form, channel_mix: form.channel_mix.includes(c) ? form.channel_mix.filter((x) => x !== c) : [...form.channel_mix, c] })}
                    className={`px-3 py-1 rounded-full text-xs border ${form.channel_mix.includes(c) ? "bg-electric-300/15 border-electric-300/50 text-electric-300" : "border-nf-border text-nf-text-muted"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-nf-text-muted block mb-2">Kulcspontok (egy sor / pont)</label>
              <Textarea rows={4} value={form.key_points.join("\n")} onChange={(e) => setForm({ ...form, key_points: e.target.value.split("\n") })} className="bg-nf-surface-alt border-nf-border" />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-nf-text-muted">Státusz</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full mt-1 rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm">
                  {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-nf-text-muted">Tervezett dátum</label>
                <Input type="date" value={form.scheduled_for ?? ""} onChange={(e) => setForm({ ...form, scheduled_for: e.target.value || null })} className="bg-nf-surface-alt border-nf-border mt-1" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShow(false)}>Mégse</Button>
              <Button variant="neon" onClick={save}>Mentés</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generated posts dialog */}
      <Dialog open={!!posts} onOpenChange={() => setPosts(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Generált posztok</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {(posts?.data?.posts ?? []).map((p: any, i: number) => (
              <Card key={i}>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-electric-300 border-electric-300/40">{p.channel}</Badge>
                    <Button size="sm" variant="outline" onClick={() => scheduleToCalendar(p, posts!.briefId)}>
                      <Calendar className="h-3 w-3 mr-1" /> Naptárba
                    </Button>
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{p.text}</div>
                  {p.hashtags && <div className="text-xs text-electric-300">{p.hashtags}</div>}
                  {p.image_idea && <div className="text-xs text-nf-text-muted italic">📷 {p.image_idea}</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

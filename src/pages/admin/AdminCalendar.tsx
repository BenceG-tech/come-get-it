import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Wand2, Loader2, MessageCircle, Send, CalendarDays, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const STATUSES = ["idea", "draft", "ready", "posted", "cancelled"];

const CHANNEL_COLORS: Record<string, string> = {
  instagram: "bg-pink-500/15 text-pink-300 border-pink-500/40",
  facebook: "bg-blue-500/15 text-blue-300 border-blue-500/40",
  linkedin: "bg-sky-500/15 text-sky-300 border-sky-500/40",
  email: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  tiktok: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/40",
  other: "bg-nf-surface-alt text-nf-text-muted border-nf-border",
};

const EMPTY_FORM = {
  scheduled_date: new Date().toISOString().slice(0, 10),
  scheduled_time: "18:00",
  channel: "instagram",
  type: "post",
  title: "",
  content_draft: "",
  hashtags: "",
  status: "idea",
  goal: "",
  assistant_rationale: "",
};

export default function AdminCalendar() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [show, setShow] = useState(false);
  const { toast } = useToast();

  // Plan generator
  const [planOpen, setPlanOpen] = useState(false);
  const [planRange, setPlanRange] = useState<"next_week" | "next_month">("next_week");
  const [planGoal, setPlanGoal] = useState("");
  const [planLoading, setPlanLoading] = useState(false);
  const [planResult, setPlanResult] = useState<{ plan: any[]; summary?: string } | null>(null);

  // Chat bubble
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("marketing_calendar").select("*").order("scheduled_date", { ascending: true });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title.trim()) return;
    const payload: any = { ...form };
    if (!payload.scheduled_time) delete payload.scheduled_time;
    const { error } = await supabase.from("marketing_calendar").insert([payload]);
    if (error) toast({ title: "Hiba", description: error.message, variant: "destructive" });
    else { setShow(false); setForm({ ...EMPTY_FORM }); load(); }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("marketing_calendar").update({ status: status as any }).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Törlöd?")) return;
    await supabase.from("marketing_calendar").delete().eq("id", id);
    load();
  };

  const runPlan = async () => {
    setPlanLoading(true); setPlanResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${FUNCTIONS_URL}/marketing-plan-suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ range: planRange, goal: planGoal }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Hiba");
      setPlanResult(j);
    } catch (e: any) { toast({ title: "Hiba", description: e?.message, variant: "destructive" }); }
    finally { setPlanLoading(false); }
  };

  const acceptAllPlanItems = async () => {
    if (!planResult?.plan) return;
    const rows = planResult.plan.map((p) => ({
      scheduled_date: p.scheduled_date, scheduled_time: p.scheduled_time, channel: p.channel,
      type: p.type, title: p.title, content_draft: p.brief, status: "draft", goal: planGoal || null,
      assistant_rationale: p.rationale,
    }));
    const { error } = await supabase.from("marketing_calendar").insert(rows as any);
    if (error) toast({ title: "Hiba", description: error.message, variant: "destructive" });
    else { toast({ title: `${rows.length} bejegyzés beütemezve` }); setPlanOpen(false); setPlanResult(null); load(); }
  };

  const acceptOne = async (p: any) => {
    const { error } = await supabase.from("marketing_calendar").insert([{
      scheduled_date: p.scheduled_date, scheduled_time: p.scheduled_time, channel: p.channel,
      type: p.type, title: p.title, content_draft: p.brief, status: "draft", goal: planGoal || null,
      assistant_rationale: p.rationale,
    } as any]);
    if (error) toast({ title: "Hiba", description: error.message, variant: "destructive" });
    else { toast({ title: "Beütemezve" }); load(); }
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const next = [...chatMessages, { role: "user" as const, content: chatInput }];
    setChatMessages(next); setChatInput(""); setChatBusy(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${FUNCTIONS_URL}/marketing-assistant-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ messages: next }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Hiba");
      setChatMessages([...next, { role: "assistant", content: j.reply }]);
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message, variant: "destructive" });
    } finally { setChatBusy(false); }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-4 md:space-y-6 pb-32">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold">Marketing naptár</h1>
          <p className="text-sm text-nf-text-muted">{items.length} tervezett bejegyzés</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPlanOpen(true)}>
            <Wand2 className="h-4 w-4 mr-1" /> AI tervez
          </Button>
          <Button variant="neon" size="sm" onClick={() => setShow(!show)} className="shrink-0">
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Új bejegyzés</span>
          </Button>
        </div>
      </div>

      {show && (
        <Card className="p-5 space-y-3 border-electric-300/40">
          <div className="grid md:grid-cols-4 gap-3">
            <Input type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} />
            <Input type="time" value={form.scheduled_time} onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })} />
            <select className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
              <option value="instagram">Instagram</option><option value="facebook">Facebook</option><option value="linkedin">LinkedIn</option><option value="email">Email</option><option value="tiktok">TikTok</option><option value="other">Egyéb</option>
            </select>
            <select className="rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="post">Poszt</option><option value="story">Story</option><option value="reel">Reel</option><option value="campaign">Kampány</option><option value="outreach">Outreach hullám</option>
            </select>
          </div>
          <Input placeholder="Cím *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea rows={4} placeholder="Tartalom draft / brief" value={form.content_draft} onChange={(e) => setForm({ ...form, content_draft: e.target.value })} />
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
            <CardHeader className="flex flex-row justify-between items-start pb-2 gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-electric-300">
                    <CalendarDays className="h-3 w-3 inline mr-1" />
                    {new Date(it.scheduled_date).toLocaleDateString("hu-HU", { weekday: "short", month: "short", day: "numeric" })}
                    {it.scheduled_time && <> · {String(it.scheduled_time).slice(0, 5)}</>}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wide ${CHANNEL_COLORS[it.channel] ?? CHANNEL_COLORS.other}`}>{it.channel}</span>
                  <span className="text-nf-text-muted">{it.type}</span>
                </div>
                <CardTitle className="text-lg mt-1">{it.title}</CardTitle>
              </div>
              <div className="flex gap-2 items-center shrink-0">
                <select className="rounded bg-nf-surface-alt border border-nf-border px-2 h-8 text-xs" value={it.status} onChange={(e) => updateStatus(it.id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => remove(it.id)} className="text-nf-text-muted hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
              </div>
            </CardHeader>
            {(it.content_draft || it.hashtags || it.assistant_rationale) && (
              <CardContent className="text-sm space-y-2">
                {it.content_draft && <div className="whitespace-pre-wrap text-nf-text-muted">{it.content_draft}</div>}
                {it.hashtags && <div className="text-electric-300 text-xs">{it.hashtags}</div>}
                {it.assistant_rationale && <div className="text-xs text-nf-text-muted italic border-l-2 border-electric-300/40 pl-2">AI: {it.assistant_rationale}</div>}
              </CardContent>
            )}
          </Card>
        ))}
        {items.length === 0 && <div className="text-center text-nf-text-muted py-12">Nincs bejegyzés. Kattints az „AI tervez” gombra egy heti tervhez.</div>}
      </div>

      {/* AI Plan Dialog */}
      <Dialog open={planOpen} onOpenChange={setPlanOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Wand2 className="h-5 w-5 text-electric-300" /> Marketing terv generálás</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-nf-text-muted">Időszak</label>
                <select className="w-full mt-1 rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={planRange} onChange={(e) => setPlanRange(e.target.value as any)}>
                  <option value="next_week">Következő 7 nap</option>
                  <option value="next_month">Következő 30 nap</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-nf-text-muted">Kampánycél (opcionális)</label>
                <Input value={planGoal} onChange={(e) => setPlanGoal(e.target.value)} placeholder="pl. Founding Partner toborzás 5. kerület" className="mt-1 bg-nf-surface-alt border-nf-border" />
              </div>
            </div>
            <Button variant="neon" onClick={runPlan} disabled={planLoading} className="w-full">
              {planLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> AI tervez…</> : <><Wand2 className="h-4 w-4 mr-2" /> Generálj tervet</>}
            </Button>

            {planResult && (
              <div className="space-y-3">
                {planResult.summary && <div className="p-3 bg-electric-300/10 border border-electric-300/30 rounded-lg text-sm">{planResult.summary}</div>}
                <div className="flex justify-end">
                  <Button size="sm" variant="neon" onClick={acceptAllPlanItems}>Mindet beütemezem ({planResult.plan?.length ?? 0})</Button>
                </div>
                <div className="space-y-2">
                  {(planResult.plan ?? []).map((p, i) => (
                    <Card key={i}>
                      <CardContent className="p-3 space-y-1">
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                          <span className="text-electric-300">{p.scheduled_date} {p.scheduled_time}</span>
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase ${CHANNEL_COLORS[p.channel] ?? CHANNEL_COLORS.other}`}>{p.channel}</span>
                          <span className="text-nf-text-muted">{p.type}</span>
                          {p.theme && <span className="text-nf-text-muted">· {p.theme}</span>}
                        </div>
                        <div className="font-medium text-sm">{p.title}</div>
                        <div className="text-xs text-nf-text-muted whitespace-pre-wrap">{p.brief}</div>
                        {p.rationale && <div className="text-[11px] text-nf-text-muted italic">↳ {p.rationale}</div>}
                        <div className="flex justify-end">
                          <Button size="sm" variant="outline" onClick={() => acceptOne(p)}>Beütemez</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating chat bubble */}
      <button onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-electric-300 text-black shadow-lg hover:scale-105 transition-transform flex items-center justify-center">
        {chatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-[90vw] max-w-sm bg-nf-surface border border-electric-300/40 rounded-xl shadow-2xl flex flex-col max-h-[70vh]">
          <div className="p-3 border-b border-nf-border flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-electric-300" />
            <div className="text-sm font-semibold">Marketing AI</div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {chatMessages.length === 0 && <div className="text-xs text-nf-text-muted">Kérdezz: „Mit posztoljak ma este?”, „Mit szólnál egy heti rekap reelhez vasárnap?”</div>}
            {chatMessages.map((m, i) => (
              <div key={i} className={`p-2 rounded-lg ${m.role === "user" ? "bg-electric-300/10 ml-6" : "bg-nf-surface-alt mr-6"}`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            ))}
            {chatBusy && <div className="text-xs text-nf-text-muted"><Loader2 className="h-3 w-3 inline animate-spin mr-1" /> gondolkodik…</div>}
          </div>
          <div className="p-2 border-t border-nf-border flex gap-2">
            <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} placeholder="Kérdezz…" className="bg-nf-surface-alt border-nf-border text-sm h-9" />
            <Button size="sm" variant="neon" onClick={sendChat} disabled={chatBusy}><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Play, Pause, Trash2, Sparkles, Mail, ListTodo, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/track";

type Step = { day_offset: number; channel: "email" | "task" | "wait"; subject?: string; body?: string; title?: string; description?: string; due_offset_days?: number };
type Sequence = { id: string; name: string; description: string | null; kind: string; steps: Step[]; active: boolean; created_at: string };
type Enrollment = { id: string; sequence_id: string; entity_type: string; entity_id: string; current_step: number; status: string; next_run_at: string | null; started_at: string };

export default function AdminOutreach() {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [partners, setPartners] = useState<Array<{ id: string; company_name: string; email: string | null }>>([]);
  const [editing, setEditing] = useState<Sequence | null>(null);
  const [openNew, setOpenNew] = useState(false);
  const [stats, setStats] = useState({ sent: 0, opened: 0, replied: 0 });

  async function load() {
    const [seq, en, ps, ev] = await Promise.all([
      supabase.from("outreach_sequences").select("*").order("created_at", { ascending: false }),
      supabase.from("outreach_enrollments").select("*").order("started_at", { ascending: false }).limit(100),
      supabase.from("partners").select("id, company_name, email").limit(500),
      supabase.from("outreach_events").select("status").gte("sent_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    ]);
    setSequences((seq.data ?? []) as any);
    setEnrollments((en.data ?? []) as any);
    setPartners((ps.data ?? []) as any);
    const evs = (ev.data ?? []) as any[];
    setStats({
      sent: evs.length,
      opened: evs.filter((e) => e.status === "opened").length,
      replied: evs.filter((e) => e.status === "replied").length,
    });
  }
  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Outreach</h1>
          <p className="text-sm text-nf-text-muted">Automatizált megkereső szekvenciák és aktív futások.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={async () => {
            const { data, error } = await supabase.functions.invoke("outreach-tick");
            if (error) toast({ title: "Hiba", description: error.message, variant: "destructive" });
            else { toast({ title: "Lefutott", description: `${(data as any)?.processed ?? 0} esemény feldolgozva` }); load(); }
          }}><Play className="h-4 w-4 mr-1" /> Tick most</Button>
          <Button onClick={() => { setEditing({ id: "", name: "", description: "", kind: "partner", steps: [], active: true, created_at: "" }); setOpenNew(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Új szekvencia
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-4 bg-nf-surface border-nf-border">
          <div className="text-xs uppercase text-nf-text-muted">7 napos kiküldés</div>
          <div className="text-3xl font-bold text-electric-300">{stats.sent}</div>
        </Card>
        <Card className="p-4 bg-nf-surface border-nf-border">
          <div className="text-xs uppercase text-nf-text-muted">Megnyitás</div>
          <div className="text-3xl font-bold text-blue-400">{stats.opened}</div>
        </Card>
        <Card className="p-4 bg-nf-surface border-nf-border">
          <div className="text-xs uppercase text-nf-text-muted">Válasz</div>
          <div className="text-3xl font-bold text-emerald-400">{stats.replied}</div>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Szekvenciák</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sequences.map((s) => (
            <Card key={s.id} className="p-4 bg-nf-surface border-nf-border">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-white">{s.name}</div>
                  <div className="text-xs text-nf-text-muted">{s.description}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={s.active ? "default" : "secondary"}>{s.active ? "aktív" : "szünet"}</Badge>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {(s.steps ?? []).map((st, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-nf-text-muted">
                    <span className="w-8 text-electric-300">+{st.day_offset}n</span>
                    {st.channel === "email" && <Mail className="h-3 w-3" />}
                    {st.channel === "task" && <ListTodo className="h-3 w-3" />}
                    {st.channel === "wait" && <Clock className="h-3 w-3" />}
                    <span className="truncate">{st.subject || st.title || st.channel}</span>
                  </div>
                ))}
                {(s.steps ?? []).length === 0 && <div className="text-xs text-nf-text-muted/60">Nincsenek lépések</div>}
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditing(s); setOpenNew(true); }}>Szerkeszt</Button>
                <Button size="sm" variant="outline" onClick={async () => {
                  await supabase.from("outreach_sequences").update({ active: !s.active }).eq("id", s.id);
                  load();
                }}>{s.active ? <><Pause className="h-3 w-3 mr-1" />Szünet</> : <><Play className="h-3 w-3 mr-1" />Indít</>}</Button>
                <EnrollDialog sequence={s} partners={partners} onDone={load} />
              </div>
            </Card>
          ))}
          {sequences.length === 0 && <div className="text-sm text-nf-text-muted">Még nincs szekvencia. Kezdj egy újjal.</div>}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Aktív enrollmentek</h2>
        <Card className="bg-nf-surface border-nf-border">
          <div className="divide-y divide-nf-border">
            {enrollments.map((e) => {
              const seq = sequences.find((s) => s.id === e.sequence_id);
              const partner = partners.find((p) => p.id === e.entity_id);
              return (
                <div key={e.id} className="p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm text-white truncate">{partner?.company_name ?? e.entity_id}</div>
                    <div className="text-xs text-nf-text-muted truncate">{seq?.name ?? "?"} · lépés {e.current_step + 1} · {e.next_run_at ? new Date(e.next_run_at).toLocaleString("hu-HU") : "—"}</div>
                  </div>
                  <Badge variant={e.status === "active" ? "default" : "secondary"}>{e.status}</Badge>
                  <Button size="sm" variant="ghost" onClick={async () => {
                    await supabase.from("outreach_enrollments").update({ status: "stopped", stop_reason: "manual", next_run_at: null }).eq("id", e.id);
                    load();
                  }}><Trash2 className="h-3 w-3" /></Button>
                </div>
              );
            })}
            {enrollments.length === 0 && <div className="p-4 text-sm text-nf-text-muted">Nincs aktív enrollment.</div>}
          </div>
        </Card>
      </div>

      {editing && (
        <SequenceEditor open={openNew} onOpenChange={(o) => { setOpenNew(o); if (!o) setEditing(null); }} sequence={editing} onSaved={load} />
      )}
    </div>
  );
}

function SequenceEditor({ open, onOpenChange, sequence, onSaved }: { open: boolean; onOpenChange: (o: boolean) => void; sequence: Sequence; onSaved: () => void }) {
  const [name, setName] = useState(sequence.name);
  const [description, setDescription] = useState(sequence.description ?? "");
  const [steps, setSteps] = useState<Step[]>(sequence.steps ?? []);

  useEffect(() => { setName(sequence.name); setDescription(sequence.description ?? ""); setSteps(sequence.steps ?? []); }, [sequence.id]);

  async function save() {
    if (!name.trim()) return toast({ title: "Név kötelező", variant: "destructive" });
    if (sequence.id) {
      await supabase.from("outreach_sequences").update({ name, description, steps: steps as any }).eq("id", sequence.id);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("outreach_sequences").insert({ name, description, steps: steps as any, kind: "partner", created_by: user?.id });
    }
    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-nf-surface border-nf-border max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{sequence.id ? "Szekvencia szerkesztése" : "Új szekvencia"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Név" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea placeholder="Leírás" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">Lépések</div>
              <Button size="sm" variant="outline" onClick={() => setSteps([...steps, { day_offset: steps.length === 0 ? 0 : 3, channel: "email", subject: "", body: "" }])}>
                <Plus className="h-3 w-3 mr-1" /> Lépés
              </Button>
            </div>
            <div className="space-y-3">
              {steps.map((st, i) => (
                <Card key={i} className="p-3 bg-nf-bg border-nf-border space-y-2">
                  <div className="flex items-center gap-2">
                    <Input type="number" className="w-20" value={st.day_offset} onChange={(e) => { const s = [...steps]; s[i].day_offset = Number(e.target.value); setSteps(s); }} />
                    <span className="text-xs text-nf-text-muted">nap múlva</span>
                    <Select value={st.channel} onValueChange={(v) => { const s = [...steps]; s[i].channel = v as any; setSteps(s); }}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="email">Email</SelectItem><SelectItem value="task">Teendő</SelectItem><SelectItem value="wait">Várakozás</SelectItem></SelectContent>
                    </Select>
                    <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setSteps(steps.filter((_, j) => j !== i))}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                  {st.channel === "email" && (
                    <>
                      <Input placeholder="Tárgy" value={st.subject ?? ""} onChange={(e) => { const s = [...steps]; s[i].subject = e.target.value; setSteps(s); }} />
                      <Textarea placeholder="Email body (használhatsz {{company_name}}, {{contact_name}} változókat)" rows={4} value={st.body ?? ""} onChange={(e) => { const s = [...steps]; s[i].body = e.target.value; setSteps(s); }} />
                    </>
                  )}
                  {st.channel === "task" && (
                    <>
                      <Input placeholder="Feladat címe" value={st.title ?? ""} onChange={(e) => { const s = [...steps]; s[i].title = e.target.value; setSteps(s); }} />
                      <Input type="number" placeholder="Határidő +nap" value={st.due_offset_days ?? 1} onChange={(e) => { const s = [...steps]; s[i].due_offset_days = Number(e.target.value); setSteps(s); }} />
                    </>
                  )}
                </Card>
              ))}
            </div>
          </div>
          <Button onClick={save} className="w-full">Mentés</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EnrollDialog({ sequence, partners, onDone }: { sequence: Sequence; partners: Array<{ id: string; company_name: string; email: string | null }>; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [partnerId, setPartnerId] = useState("");

  async function enroll() {
    if (!partnerId) return;
    const { data: { user } } = await supabase.auth.getUser();
    const firstStep = sequence.steps?.[0];
    const offset = Number(firstStep?.day_offset ?? 0);
    await supabase.from("outreach_enrollments").insert({
      sequence_id: sequence.id,
      entity_type: "partner",
      entity_id: partnerId,
      current_step: 0,
      status: "active",
      next_run_at: new Date(Date.now() + offset * 86400000).toISOString(),
      created_by: user?.id,
    });
    trackEvent("sequence_enrolled", { entity_type: "partner", entity_id: partnerId, metadata: { sequence_id: sequence.id } });
    toast({ title: "Beíratva" });
    setOpen(false);
    setPartnerId("");
    onDone();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={!sequence.active || (sequence.steps?.length ?? 0) === 0}>
          <Sparkles className="h-3 w-3 mr-1" /> Beír partnert
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-nf-surface border-nf-border">
        <DialogHeader><DialogTitle>Partner beírása: {sequence.name}</DialogTitle></DialogHeader>
        <Select value={partnerId} onValueChange={setPartnerId}>
          <SelectTrigger><SelectValue placeholder="Válassz partnert" /></SelectTrigger>
          <SelectContent>
            {partners.filter((p) => p.email).map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.company_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={enroll} disabled={!partnerId}>Beír</Button>
      </DialogContent>
    </Dialog>
  );
}

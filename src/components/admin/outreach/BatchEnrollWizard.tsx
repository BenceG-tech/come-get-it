import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Rocket, Loader2, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Sequence = { id: string; name: string; steps: any[]; active: boolean };
type Lead = { id: string; company_name: string; email: string | null; status: string | null; ai_score: number | null };

export default function BatchEnrollWizard({ sequences, onDone }: { sequences: Sequence[]; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [sequenceId, setSequenceId] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("lead");
  const [minScore, setMinScore] = useState<number>(0);
  const [requireEmail, setRequireEmail] = useState(true);
  const [excludeEnrolled, setExcludeEnrolled] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);

  const activeSeq = sequences.filter((s) => s.active && (s.steps?.length ?? 0) > 0);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    (async () => {
      const [p, en] = await Promise.all([
        supabase.from("partners").select("id, company_name, email, status, ai_score").limit(500),
        supabase.from("outreach_enrollments").select("entity_id").in("status", ["active", "done"]),
      ]);
      setLeads((p.data ?? []) as any);
      setEnrolledIds(new Set(((en.data ?? []) as any[]).map((x) => x.entity_id)));
      setLoading(false);
    })();
  }, [open]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== "any" && (l.status ?? "lead") !== statusFilter) return false;
      if (minScore > 0 && (l.ai_score ?? 0) < minScore) return false;
      if (requireEmail && !l.email) return false;
      if (excludeEnrolled && enrolledIds.has(l.id)) return false;
      return true;
    });
  }, [leads, statusFilter, minScore, requireEmail, excludeEnrolled, enrolledIds]);

  useEffect(() => {
    setSelected(new Set(filtered.map((l) => l.id)));
  }, [filtered]);

  async function run() {
    if (!sequenceId || selected.size === 0) return;
    const seq = sequences.find((s) => s.id === sequenceId);
    if (!seq) return;
    setRunning(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const firstOffset = Number(seq.steps?.[0]?.day_offset ?? 0);
      const nextRun = new Date(Date.now() + firstOffset * 86400000).toISOString();
      const rows = Array.from(selected).map((id) => ({
        sequence_id: sequenceId,
        entity_type: "partner",
        entity_id: id,
        current_step: 0,
        status: "active",
        next_run_at: nextRun,
        created_by: user?.id,
      }));
      // chunked insert
      const chunk = 50;
      for (let i = 0; i < rows.length; i += chunk) {
        const { error } = await supabase.from("outreach_enrollments").insert(rows.slice(i, i + chunk));
        if (error) throw error;
      }
      toast({ title: `${rows.length} lead beíratva`, description: seq.name });
      setOpen(false);
      onDone();
    } catch (e: any) {
      toast({ title: "Hiba", description: e.message, variant: "destructive" });
    } finally {
      setRunning(false);
    }
  }

  function toggle(id: string) {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-electric-300 text-black hover:bg-electric-400">
          <Rocket className="h-4 w-4 mr-1" /> Tömeges beíratás
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-nf-surface border-nf-border max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Tömeges lead-beíratás szekvenciába</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Szekvencia</Label>
            <Select value={sequenceId} onValueChange={setSequenceId}>
              <SelectTrigger><SelectValue placeholder="Válassz szekvenciát" /></SelectTrigger>
              <SelectContent>
                {activeSeq.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} ({s.steps.length} lépés)</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Status szűrő</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Mindegy</SelectItem>
                <SelectItem value="lead">lead</SelectItem>
                <SelectItem value="contacted">contacted</SelectItem>
                <SelectItem value="negotiating">negotiating</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Min. AI score</Label>
            <Input type="number" min={0} max={100} value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} />
          </div>
          <div className="flex items-center gap-4 mt-5">
            <label className="flex items-center gap-2 text-xs">
              <Checkbox checked={requireEmail} onCheckedChange={(v) => setRequireEmail(!!v)} /> Csak email-mel
            </label>
            <label className="flex items-center gap-2 text-xs">
              <Checkbox checked={excludeEnrolled} onCheckedChange={(v) => setExcludeEnrolled(!!v)} /> Kihagyja a már beírtakat
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-nf-text-muted flex items-center gap-2">
            <Users className="h-3 w-3" /> {selected.size} kiválasztva / {filtered.length} találat
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set(filtered.map((l) => l.id)))}>Mind</Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Egyik se</Button>
          </div>
        </div>

        <Card className="bg-nf-bg border-nf-border max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center"><Loader2 className="h-4 w-4 animate-spin inline" /></div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-sm text-nf-text-muted text-center">Nincs találat a szűrőkre.</div>
          ) : (
            <div className="divide-y divide-nf-border">
              {filtered.slice(0, 200).map((l) => (
                <label key={l.id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-nf-surface/40">
                  <Checkbox checked={selected.has(l.id)} onCheckedChange={() => toggle(l.id)} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{l.company_name}</div>
                    <div className="text-xs text-nf-text-muted truncate">{l.email ?? "—"}</div>
                  </div>
                  {l.ai_score != null && <Badge variant="outline">{Math.round(l.ai_score)}</Badge>}
                </label>
              ))}
              {filtered.length > 200 && <div className="p-2 text-[10px] text-nf-text-muted text-center">+{filtered.length - 200} további…</div>}
            </div>
          )}
        </Card>

        <Button className="w-full" disabled={!sequenceId || selected.size === 0 || running} onClick={run}>
          {running ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
          {selected.size} lead beíratása
        </Button>
      </DialogContent>
    </Dialog>
  );
}

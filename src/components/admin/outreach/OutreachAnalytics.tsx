import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { Mail, MailOpen, MousePointerClick, Reply, TrendingUp } from "lucide-react";

type Sequence = { id: string; name: string; steps: any[] };
type Event = {
  id: string;
  enrollment_id: string;
  step_index: number;
  channel: string;
  status: string;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  replied_at: string | null;
};
type Enrollment = { id: string; sequence_id: string };

const RANGES = [
  { v: 7, l: "7 nap" },
  { v: 30, l: "30 nap" },
  { v: 90, l: "90 nap" },
];

function pct(n: number, d: number) {
  if (!d) return 0;
  return Math.round((n / d) * 1000) / 10;
}

export default function OutreachAnalytics() {
  const [days, setDays] = useState(30);
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedSeq, setSelectedSeq] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const [seq, en, ev] = await Promise.all([
      supabase.from("outreach_sequences").select("id, name, steps"),
      supabase.from("outreach_enrollments").select("id, sequence_id"),
      supabase
        .from("outreach_events")
        .select("id, enrollment_id, step_index, channel, status, sent_at, opened_at, clicked_at, replied_at")
        .gte("sent_at", since)
        .order("sent_at", { ascending: false })
        .limit(5000),
    ]);
    setSequences((seq.data ?? []) as any);
    setEnrollments((en.data ?? []) as any);
    setEvents((ev.data ?? []) as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, [days]);

  // sequence id by enrollment
  const enrollSeq = useMemo(() => {
    const m = new Map<string, string>();
    for (const e of enrollments) m.set(e.id, e.sequence_id);
    return m;
  }, [enrollments]);

  // per-sequence aggregates
  const bySequence = useMemo(() => {
    const agg: Record<string, { sent: number; opened: number; clicked: number; replied: number }> = {};
    for (const e of events) {
      const sid = enrollSeq.get(e.enrollment_id);
      if (!sid) continue;
      const a = (agg[sid] ||= { sent: 0, opened: 0, clicked: 0, replied: 0 });
      if (e.sent_at) a.sent++;
      if (e.opened_at) a.opened++;
      if (e.clicked_at) a.clicked++;
      if (e.replied_at) a.replied++;
    }
    return agg;
  }, [events, enrollSeq]);

  // totals
  const totals = useMemo(() => {
    let sent = 0, opened = 0, clicked = 0, replied = 0;
    for (const e of events) {
      if (e.sent_at) sent++;
      if (e.opened_at) opened++;
      if (e.clicked_at) clicked++;
      if (e.replied_at) replied++;
    }
    return { sent, opened, clicked, replied };
  }, [events]);

  // daily trend
  const trend = useMemo(() => {
    const buckets = new Map<string, { date: string; sent: number; opened: number; replied: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const k = d.toISOString().slice(0, 10);
      buckets.set(k, { date: k.slice(5), sent: 0, opened: 0, replied: 0 });
    }
    for (const e of events) {
      if (!e.sent_at) continue;
      const k = e.sent_at.slice(0, 10);
      const b = buckets.get(k);
      if (!b) continue;
      b.sent++;
      if (e.opened_at) b.opened++;
      if (e.replied_at) b.replied++;
    }
    return Array.from(buckets.values());
  }, [events, days]);

  // step funnel for selected sequence
  const stepFunnel = useMemo(() => {
    if (!selectedSeq) return [];
    const seq = sequences.find((s) => s.id === selectedSeq);
    if (!seq) return [];
    const enrollIds = new Set(enrollments.filter((e) => e.sequence_id === selectedSeq).map((e) => e.id));
    const perStep: Record<number, { sent: number; opened: number; clicked: number; replied: number }> = {};
    for (const e of events) {
      if (!enrollIds.has(e.enrollment_id)) continue;
      const a = (perStep[e.step_index] ||= { sent: 0, opened: 0, clicked: 0, replied: 0 });
      if (e.sent_at) a.sent++;
      if (e.opened_at) a.opened++;
      if (e.clicked_at) a.clicked++;
      if (e.replied_at) a.replied++;
    }
    const n = (seq.steps ?? []).length || Math.max(0, ...Object.keys(perStep).map(Number)) + 1;
    return Array.from({ length: n }, (_, i) => ({
      step: `#${i + 1}`,
      ...(perStep[i] ?? { sent: 0, opened: 0, clicked: 0, replied: 0 }),
    }));
  }, [selectedSeq, events, enrollments, sequences]);

  const seqRows = useMemo(() => {
    return sequences
      .map((s) => {
        const a = bySequence[s.id] ?? { sent: 0, opened: 0, clicked: 0, replied: 0 };
        return { ...s, ...a, openRate: pct(a.opened, a.sent), replyRate: pct(a.replied, a.sent), clickRate: pct(a.clicked, a.sent) };
      })
      .sort((a, b) => b.sent - a.sent);
  }, [sequences, bySequence]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-electric-300" /> Analitika
        </h2>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <Button key={r.v} size="sm" variant={days === r.v ? "neon" : "outline"} onClick={() => setDays(r.v)}>{r.l}</Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Mail className="h-4 w-4" />} label="Kiküldve" value={totals.sent} color="text-electric-300" />
        <StatCard icon={<MailOpen className="h-4 w-4" />} label="Megnyitva" value={totals.opened} sub={`${pct(totals.opened, totals.sent)}%`} color="text-blue-400" />
        <StatCard icon={<MousePointerClick className="h-4 w-4" />} label="Kattintva" value={totals.clicked} sub={`${pct(totals.clicked, totals.sent)}%`} color="text-amber-400" />
        <StatCard icon={<Reply className="h-4 w-4" />} label="Válasz" value={totals.replied} sub={`${pct(totals.replied, totals.sent)}%`} color="text-emerald-400" />
      </div>

      <Card className="p-4 bg-nf-surface border-nf-border">
        <div className="text-sm font-semibold text-white mb-3">Napi trend</div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #1f2937" }} />
              <Line type="monotone" dataKey="sent" stroke="#00bcd4" strokeWidth={2} dot={false} name="Küldve" />
              <Line type="monotone" dataKey="opened" stroke="#60a5fa" strokeWidth={2} dot={false} name="Megnyitva" />
              <Line type="monotone" dataKey="replied" stroke="#34d399" strokeWidth={2} dot={false} name="Válasz" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 bg-nf-surface border-nf-border">
        <div className="text-sm font-semibold text-white mb-3">Szekvenciák teljesítménye (A/B insight)</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-nf-text-muted">
              <tr className="border-b border-nf-border">
                <th className="text-left py-2 px-2">Név</th>
                <th className="text-right py-2 px-2">Küldve</th>
                <th className="text-right py-2 px-2">Open %</th>
                <th className="text-right py-2 px-2">Click %</th>
                <th className="text-right py-2 px-2">Reply %</th>
                <th className="text-right py-2 px-2">Részletek</th>
              </tr>
            </thead>
            <tbody>
              {seqRows.map((r) => {
                const winner = r.replyRate >= 10 && r.sent >= 5;
                return (
                  <tr key={r.id} className="border-b border-nf-border/50 hover:bg-nf-surface-alt/40">
                    <td className="py-2 px-2 text-white">
                      <div className="flex items-center gap-2">
                        {r.name}
                        {winner && <Badge variant="default" className="text-[10px]">⭐ jól megy</Badge>}
                      </div>
                    </td>
                    <td className="text-right py-2 px-2">{r.sent}</td>
                    <td className="text-right py-2 px-2 text-blue-400">{r.openRate}%</td>
                    <td className="text-right py-2 px-2 text-amber-400">{r.clickRate}%</td>
                    <td className="text-right py-2 px-2 text-emerald-400">{r.replyRate}%</td>
                    <td className="text-right py-2 px-2">
                      <Button size="sm" variant="ghost" onClick={() => setSelectedSeq(r.id)}>Funnel</Button>
                    </td>
                  </tr>
                );
              })}
              {seqRows.length === 0 && (
                <tr><td colSpan={6} className="py-4 text-center text-nf-text-muted text-xs">Nincs adat ebben az időszakban.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedSeq && (
        <Card className="p-4 bg-nf-surface border-nf-border">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-white">
              Lépés-funnel: {sequences.find((s) => s.id === selectedSeq)?.name}
            </div>
            <Select value={selectedSeq} onValueChange={setSelectedSeq}>
              <SelectTrigger className="w-56 h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                {sequences.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepFunnel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="step" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #1f2937" }} />
                <Bar dataKey="sent" fill="#00bcd4" name="Küldve" />
                <Bar dataKey="opened" fill="#60a5fa" name="Megnyitva" />
                <Bar dataKey="clicked" fill="#fbbf24" name="Kattintva" />
                <Bar dataKey="replied" fill="#34d399" name="Válasz" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {loading && <div className="text-xs text-nf-text-muted">Betöltés…</div>}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: number; sub?: string; color: string }) {
  return (
    <Card className="p-4 bg-nf-surface border-nf-border">
      <div className="flex items-center gap-2 text-xs uppercase text-nf-text-muted">{icon} {label}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-nf-text-muted mt-1">{sub}</div>}
    </Card>
  );
}

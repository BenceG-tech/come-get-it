import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";

type Props = {
  pillar: "partner" | "waitlist" | "sponsor";
  label: string;
  current: number;
  target: number;
  fetchSnapshots: () => Promise<{ date: string; value: number }[]>;
  fetchBlockers: () => Promise<{ label: string; count: number }[]>;
};

export default function MissionPillarPanel({ pillar, label, current, target, fetchSnapshots, fetchBlockers }: Props) {
  const [series, setSeries] = useState<{ date: string; value: number }[]>([]);
  const [blockers, setBlockers] = useState<{ label: string; count: number }[]>([]);

  useEffect(() => {
    fetchSnapshots().then(setSeries);
    fetchBlockers().then(setBlockers);
  }, [pillar]);

  const deadline = new Date(new Date().getFullYear(), 8, 1);
  if (deadline.getTime() < Date.now()) deadline.setFullYear(deadline.getFullYear() + 1);
  const daysLeft = Math.max(1, Math.ceil((deadline.getTime() - Date.now()) / 86400000));

  // Forecast: weekly velocity from last 14 days
  const last14 = series.slice(-14);
  const weeklyVelocity = last14.length >= 2
    ? ((last14[last14.length - 1].value - last14[0].value) / Math.max(1, last14.length - 1)) * 7
    : 0;
  const projected = current + (weeklyVelocity / 7) * daysLeft;
  const onTrack = projected >= target;
  const neededPerWeek = Math.max(0, ((target - current) / daysLeft) * 7);
  const pct = Math.min(100, (current / target) * 100);

  return (
    <div className="space-y-4">
      {/* Number + progress */}
      <Card className="p-5 border-electric-300/30">
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-nf-text-muted">{label}</div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-5xl font-bold text-electric-300">{current}</div>
              <div className="text-sm text-nf-text-muted">/ {target} cél</div>
            </div>
          </div>
          <div className={`text-right ${onTrack ? "text-electric-300" : "text-red-400"}`}>
            <div className="flex items-center gap-1 justify-end text-xs uppercase tracking-wider">
              {onTrack ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {onTrack ? "Ütemben" : "Csúszunk"}
            </div>
            <div className="text-2xl font-bold">{Math.round(projected)}</div>
            <div className="text-[10px] text-nf-text-muted">előrejelzés szept. 1-re</div>
          </div>
        </div>
        <div className="h-2 bg-nf-surface-alt rounded-full overflow-hidden">
          <div className="h-full bg-electric-300 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-xs text-nf-text-muted mt-2">
          Kell: <span className="text-electric-300 font-medium">{Math.ceil(neededPerWeek)}/hét</span> az utolérésig · {daysLeft} nap van hátra
        </div>
      </Card>

      {/* Sparkline */}
      <Card className="p-4">
        <div className="text-xs uppercase tracking-wider text-nf-text-muted mb-2">30 napos trend</div>
        {series.length > 0 ? (
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <XAxis dataKey="date" hide />
                <Tooltip
                  contentStyle={{ background: "#050505", border: "1px solid #00bcd4", fontSize: 11 }}
                  labelStyle={{ color: "#8a8a8a" }}
                  itemStyle={{ color: "#00bcd4" }}
                />
                <ReferenceLine y={target} stroke="#00bcd4" strokeDasharray="3 3" opacity={0.4} />
                <Line type="monotone" dataKey="value" stroke="#00bcd4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-sm text-nf-text-muted">Még nincs elég napi snapshot</div>
        )}
      </Card>

      {/* Blockers */}
      <Card className="p-4">
        <div className="text-xs uppercase tracking-wider text-nf-text-muted mb-2 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> Mi húzza / mi blokkolja
        </div>
        {blockers.length === 0 && <div className="text-sm text-nf-text-muted">Nincs adat.</div>}
        <div className="space-y-1.5">
          {blockers.map((b, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span>{b.label}</span>
              <span className="text-electric-300 font-mono">{b.count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

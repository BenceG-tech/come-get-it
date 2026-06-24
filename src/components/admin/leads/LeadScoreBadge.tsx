import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sparkles } from "lucide-react";

export function getScoreColor(score: number | null | undefined) {
  if (score == null) return { bg: "bg-nf-surface-alt", text: "text-nf-text-muted", border: "border-nf-border", label: "—" };
  if (score >= 80) return { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/40", label: `${score}` };
  if (score >= 50) return { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/40", label: `${score}` };
  return { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/40", label: `${score}` };
}

type ScoreReasons = {
  baseline?: number;
  adjustment?: number;
  total?: number;
  grade?: string;
  breakdown?: { label: string; points: number; max: number; note?: string }[];
  ai_overlay?: { summary?: string; reasons?: { factor: string; impact: string; note: string }[] };
};

export default function LeadScoreBadge({
  score, size = "sm", reasons,
}: { score: number | null | undefined; size?: "sm" | "md"; reasons?: ScoreReasons | null }) {
  const c = getScoreColor(score);
  const dim = size === "md" ? "h-7 min-w-[2.5rem] text-sm" : "h-5 min-w-[2rem] text-[10px]";
  const badge = (
    <span className={`inline-flex items-center justify-center px-2 rounded-full font-bold border cursor-pointer ${c.bg} ${c.text} ${c.border} ${dim}`}>
      {c.label}
    </span>
  );
  if (!reasons?.breakdown?.length) {
    return <span title={score != null ? `Lead-score: ${score}/100 — kattints új scoringért` : "Még nincs pontozva"}>{badge}</span>;
  }
  return (
    <Popover>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>{badge}</PopoverTrigger>
      <PopoverContent className="w-80 p-3 bg-nf-surface border-nf-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Score breakdown</div>
          <div className={`text-xs px-2 py-0.5 rounded ${c.bg} ${c.text}`}>{reasons.total ?? score} / 100 · {reasons.grade}</div>
        </div>
        <div className="space-y-1.5">
          {reasons.breakdown.map((l) => (
            <div key={l.label} className="text-[11px]">
              <div className="flex justify-between">
                <span className="text-nf-text">{l.label}</span>
                <span className="text-nf-text-muted font-mono">{l.points}/{l.max}</span>
              </div>
              {l.note && <div className="text-[10px] text-nf-text-muted">{l.note}</div>}
              <div className="h-1 bg-nf-surface-alt rounded-full mt-0.5 overflow-hidden">
                <div className="h-full bg-electric-300" style={{ width: `${(l.points / Math.max(1, l.max)) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        {reasons.ai_overlay && (reasons.adjustment ?? 0) !== 0 && (
          <div className="mt-3 pt-2 border-t border-nf-border">
            <div className="text-[11px] font-semibold flex items-center gap-1 mb-1">
              <Sparkles className="w-3 h-3 text-electric-300" />
              AI módosítás: <span className={reasons.adjustment! > 0 ? "text-green-400" : "text-red-400"}>{reasons.adjustment! > 0 ? "+" : ""}{reasons.adjustment}</span>
            </div>
            {reasons.ai_overlay.summary && <div className="text-[10px] text-nf-text-muted mb-1">{reasons.ai_overlay.summary}</div>}
            {reasons.ai_overlay.reasons?.map((r, i) => (
              <div key={i} className="text-[10px] text-nf-text-muted">• <span className="text-nf-text">{r.factor}</span> ({r.impact}) — {r.note}</div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

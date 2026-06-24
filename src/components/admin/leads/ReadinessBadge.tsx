import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Loader2, Play } from "lucide-react";
import { getReadiness, getMissingStep, READINESS_LABEL, READINESS_COLORS, type ReadinessLevel } from "@/lib/lead-readiness";

export default function ReadinessBadge({
  partner,
  onContinue,
  loading,
}: {
  partner: any;
  onContinue?: (step: "research" | "score" | "grade") => void;
  loading?: boolean;
}) {
  const r = getReadiness(partner);
  const missing = getMissingStep(partner);
  const dots = [0, 1, 2, 3].map((i) =>
    i <= r ? (
      <span key={i} className={`w-1.5 h-1.5 rounded-full ${r === 3 ? "bg-emerald-400" : "bg-electric-300"}`} />
    ) : (
      <span key={i} className="w-1.5 h-1.5 rounded-full bg-nf-border" />
    ),
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-medium hover:bg-nf-surface-alt/60 transition ${READINESS_COLORS[r as ReadinessLevel]}`}
          title={`AI állapot: ${READINESS_LABEL[r as ReadinessLevel]}`}
        >
          <span className="flex items-center gap-0.5">{dots}</span>
          <span>{READINESS_LABEL[r as ReadinessLevel]}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-xs bg-nf-surface border-nf-border space-y-2">
        <div className="font-semibold text-electric-300">{READINESS_LABEL[r as ReadinessLevel]}</div>
        <div className="space-y-1 text-nf-text-muted">
          <div className={r >= 1 ? "text-emerald-300" : ""}>{r >= 1 ? "✓" : "○"} Kutatva (research)</div>
          <div className={r >= 2 ? "text-emerald-300" : ""}>{r >= 2 ? "✓" : "○"} Pontozva (score{partner?.lead_score != null ? `: ${partner.lead_score}` : ""})</div>
          <div className={r >= 3 ? "text-emerald-300" : ""}>{r >= 3 ? "✓" : "○"} Értékelve (grade{partner?.lead_grade ? `: ${partner.lead_grade}` : ""})</div>
        </div>
        {missing && onContinue && (
          <Button
            size="sm"
            variant="neon"
            className="w-full"
            disabled={loading}
            onClick={() => onContinue(missing)}
          >
            {loading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
            Folytat: {missing === "research" ? "Kutatás" : missing === "score" ? "Pontozás" : "Grade"}
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

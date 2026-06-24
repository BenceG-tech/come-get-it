import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { getReadiness, READINESS_LABEL, READINESS_NEXT, type ReadinessLevel } from "@/lib/lead-readiness";

type Props = {
  partners: any[];
  activeLevel: ReadinessLevel | "all";
  onSelectLevel: (l: ReadinessLevel | "all") => void;
  onProcessLevel: (l: ReadinessLevel, ids: string[]) => void;
  busyLevel?: ReadinessLevel | null;
};

const ACCENTS: Record<ReadinessLevel, string> = {
  0: "border-nf-border hover:border-nf-text-muted/60",
  1: "border-amber-500/40 hover:border-amber-500/80",
  2: "border-electric-300/40 hover:border-electric-300/80",
  3: "border-emerald-500/40 hover:border-emerald-500/80",
};
const TEXTS: Record<ReadinessLevel, string> = {
  0: "text-nf-text-muted",
  1: "text-amber-300",
  2: "text-electric-300",
  3: "text-emerald-300",
};

export default function ReadinessPipelineBar({ partners, activeLevel, onSelectLevel, onProcessLevel, busyLevel }: Props) {
  const buckets: Record<ReadinessLevel, any[]> = { 0: [], 1: [], 2: [], 3: [] };
  partners.forEach((p) => buckets[getReadiness(p)].push(p));
  const total = partners.length || 1;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      {([0, 1, 2, 3] as ReadinessLevel[]).map((lvl) => {
        const list = buckets[lvl];
        const isActive = activeLevel === lvl;
        const pct = Math.round((list.length / total) * 100);
        return (
          <Card
            key={lvl}
            className={`p-3 cursor-pointer transition border-2 ${isActive ? "border-electric-300 bg-electric-300/5" : ACCENTS[lvl]}`}
            onClick={() => onSelectLevel(isActive ? "all" : lvl)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className={`text-xs uppercase tracking-wider ${TEXTS[lvl]} font-semibold`}>{READINESS_LABEL[lvl]}</div>
                <div className="text-2xl font-bold mt-0.5">{list.length}</div>
                <div className="text-[10px] text-nf-text-muted">{READINESS_NEXT[lvl]}</div>
              </div>
              {lvl < 3 && list.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 shrink-0"
                  title={`Az összes ${list.length} ${READINESS_LABEL[lvl].toLowerCase()} lead feldolgozása`}
                  disabled={busyLevel === lvl}
                  onClick={(e) => {
                    e.stopPropagation();
                    onProcessLevel(lvl, list.map((p) => p.id));
                  }}
                >
                  {busyLevel === lvl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                </Button>
              )}
            </div>
            <div className="mt-2 h-1 rounded-full bg-nf-surface-alt overflow-hidden">
              <div
                className={`h-full ${
                  lvl === 0 ? "bg-nf-text-muted/40" : lvl === 1 ? "bg-amber-400" : lvl === 2 ? "bg-electric-300" : "bg-emerald-400"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

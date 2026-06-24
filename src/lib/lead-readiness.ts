// AI Readiness model — kliens-oldali, partner mezők alapján számolt
// 0 = Nyers, 1 = Kutatva, 2 = Pontozva, 3 = Értékelve

export type ReadinessLevel = 0 | 1 | 2 | 3;
export type MissingStep = "research" | "score" | "grade" | null;

export function getReadiness(p: any): ReadinessLevel {
  const hasResearch = !!(p?.research_notes || p?.research_dossier || p?.last_researched_at);
  const hasScore = p?.lead_score != null || p?.ai_score != null;
  const hasGrade = !!p?.lead_grade;
  if (hasGrade) return 3;
  if (hasScore) return 2;
  if (hasResearch) return 1;
  return 0;
}

export const READINESS_LABEL: Record<ReadinessLevel, string> = {
  0: "Nyers",
  1: "Kutatva",
  2: "Pontozva",
  3: "Értékelve",
};

export const READINESS_NEXT: Record<ReadinessLevel, string> = {
  0: "→ Research",
  1: "→ Score",
  2: "→ Grade",
  3: "✓ Kész",
};

export function getMissingStep(p: any): MissingStep {
  const r = getReadiness(p);
  if (r === 0) return "research";
  if (r === 1) return "score";
  if (r === 2) return "grade";
  return null;
}

export const READINESS_COLORS: Record<ReadinessLevel, string> = {
  0: "text-nf-text-muted border-nf-border",
  1: "text-amber-300 border-amber-500/40",
  2: "text-electric-300 border-electric-300/40",
  3: "text-emerald-300 border-emerald-500/40",
};

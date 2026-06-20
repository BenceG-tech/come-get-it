export function getScoreColor(score: number | null | undefined) {
  if (score == null) return { bg: "bg-nf-surface-alt", text: "text-nf-text-muted", border: "border-nf-border", label: "—" };
  if (score >= 80) return { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/40", label: `${score}` };
  if (score >= 50) return { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/40", label: `${score}` };
  return { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/40", label: `${score}` };
}

export default function LeadScoreBadge({ score, size = "sm" }: { score: number | null | undefined; size?: "sm" | "md" }) {
  const c = getScoreColor(score);
  const dim = size === "md" ? "h-7 min-w-[2.5rem] text-sm" : "h-5 min-w-[2rem] text-[10px]";
  return (
    <span className={`inline-flex items-center justify-center px-2 rounded-full font-bold border ${c.bg} ${c.text} ${c.border} ${dim}`} title={score != null ? `Lead-score: ${score}/100` : "Még nincs pontozva"}>
      {c.label}
    </span>
  );
}

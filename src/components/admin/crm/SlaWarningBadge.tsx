import { AlertTriangle } from "lucide-react";

interface Props {
  updatedAt?: string | null;
  slaDays?: number | null;
  className?: string;
}

export default function SlaWarningBadge({ updatedAt, slaDays, className }: Props) {
  if (!updatedAt || !slaDays || slaDays <= 0) return null;
  const ageDays = (Date.now() - new Date(updatedAt).getTime()) / 86400000;
  if (ageDays <= slaDays) return null;
  const over = Math.floor(ageDays - slaDays);
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-red-500/15 text-red-400 ${className ?? ""}`}
      title={`SLA túllépve ${over} napja (${slaDays} napos limit)`}
    >
      <AlertTriangle className="h-3 w-3" />
      SLA +{over}n
    </span>
  );
}

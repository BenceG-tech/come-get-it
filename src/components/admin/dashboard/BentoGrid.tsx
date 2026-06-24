import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 12-oszlopos bento rács admin dashboardhoz. Mobilon auto-stack. */
export function BentoGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-3 md:gap-4",
        "auto-rows-[minmax(140px,auto)]",
        className
      )}
    >
      {children}
    </div>
  );
}

type Tone = "default" | "accent" | "dim" | "hero";

const TONE: Record<Tone, string> = {
  default:
    "bg-[hsl(var(--admin-surface-1))] border-[hsl(var(--admin-border))]",
  accent:
    "bg-gradient-to-br from-[hsl(var(--admin-surface-2))] to-[hsl(var(--admin-surface-1))] border-[hsl(var(--admin-border-strong))]",
  dim:
    "bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))]/60",
  hero:
    "bg-gradient-to-br from-[hsl(var(--admin-primary)/0.08)] via-[hsl(var(--admin-surface-2))] to-[hsl(var(--admin-surface-1))] border-[hsl(var(--admin-primary)/0.30)]",
};

const SPAN_COL: Record<number, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "md:col-span-3 lg:col-span-6",
  7: "lg:col-span-7",
  8: "md:col-span-6 lg:col-span-8",
  9: "lg:col-span-9",
  10: "lg:col-span-10",
  11: "lg:col-span-11",
  12: "md:col-span-6 lg:col-span-12",
};

const SPAN_ROW: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
};

export function BentoCard({
  children,
  className,
  colSpan = 4,
  rowSpan = 1,
  tone = "default",
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  rowSpan?: 1 | 2 | 3;
  tone?: Tone;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-4 md:p-5",
        "transition-all duration-200 ease-out",
        TONE[tone],
        SPAN_COL[colSpan],
        SPAN_ROW[rowSpan],
        interactive &&
          "hover:-translate-y-0.5 hover:border-[hsl(var(--admin-border-strong))] hover:shadow-[0_8px_30px_-12px_hsl(var(--admin-primary)/0.35)]",
        "animate-in fade-in slide-in-from-bottom-2 duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}

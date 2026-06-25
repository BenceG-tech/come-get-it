import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface SegmentOption<T extends string = string> {
  id: T;
  label: string;
  icon?: LucideIcon;
}

interface Props<T extends string> {
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
  className?: string;
}

export function SegmentedControl<T extends string>({ options, value, onChange, size = "sm", className }: Props<T>) {
  const idx = useMemo(() => Math.max(0, options.findIndex((o) => o.id === value)), [options, value]);
  const w = 100 / options.length;
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] p-1",
        className
      )}
    >
      <span
        className="absolute top-1 bottom-1 rounded-full bg-electric-300/15 ring-1 ring-electric-300/30 transition-transform duration-300 ease-out"
        style={{ width: `calc(${w}% - 4px)`, transform: `translateX(calc(${idx * 100}% + ${idx * 4}px))`, left: 4 }}
      />
      {options.map((o) => {
        const Icon = o.icon;
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-colors",
              pad,
              active ? "text-electric-300" : "text-white/60 hover:text-white/90"
            )}
            style={{ flex: `0 0 ${w}%` }}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;

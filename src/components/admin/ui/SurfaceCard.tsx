import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "base" | "accent" | "sub";

interface SurfaceCardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  padded?: boolean;
}

/**
 * Egységes admin felület-kártya 3 szinttel:
 *  - base   : alap kártya (sötét, finom border)
 *  - accent : kiemelt kártya — felső cyan glow-vonal, lágy radial háttér
 *  - sub    : kártyán belüli al-blokk, bal oldali accent sáv
 */
export const SurfaceCard = forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ tone = "base", title, subtitle, icon, action, padded = true, className, children, ...rest }, ref) => {
    const base =
      "relative rounded-2xl border transition-colors";
    const toneCls: Record<Tone, string> = {
      base: "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]",
      accent:
        "bg-[radial-gradient(120%_80%_at_0%_0%,hsl(var(--electric-300)/0.06),transparent_60%)] border-electric-300/20 shadow-[inset_0_1px_0_0_hsl(var(--electric-300)/0.25)]",
      sub: "bg-white/[0.015] border-white/[0.05] rounded-xl",
    };

    return (
      <div ref={ref} className={cn(base, toneCls[tone], className)} {...rest}>
        {tone === "sub" && (
          <span className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-electric-300/40" />
        )}
        {(title || action) && (
          <div className={cn("flex items-start gap-3", padded ? "px-5 pt-4" : "")}>
            {icon && (
              <div className="mt-0.5 h-8 w-8 shrink-0 rounded-lg bg-electric-300/10 text-electric-300 grid place-items-center">
                {icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              {title && (
                <div className="admin-display text-[15px] font-semibold leading-tight text-foreground">
                  {title}
                </div>
              )}
              {subtitle && (
                <div className="mt-0.5 text-xs text-white/50">{subtitle}</div>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        <div className={cn(padded ? "p-5" : "", title && padded ? "pt-4" : "")}>{children}</div>
      </div>
    );
  }
);
SurfaceCard.displayName = "SurfaceCard";

export default SurfaceCard;

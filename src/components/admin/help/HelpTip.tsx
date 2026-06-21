import { HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  /** Mi ez? — 1 mondat */
  what: string;
  /** Mire jó? — 1 mondat (opcionális) */
  why?: string;
  /** Mit csinálj most? — 1 konkrét akció (opcionális) */
  how?: string;
  className?: string;
  size?: "xs" | "sm";
  side?: "top" | "right" | "bottom" | "left";
}

/**
 * Kis `?` ikon, ami koppintásra/hover-re kinyit egy súgó-buborékot.
 * Mobilon tap, desktopon click — Popover mindkettőt kezeli.
 */
export default function HelpTip({ what, why, how, className, size = "xs", side = "top" }: Props) {
  const iconSize = size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label="Súgó"
          className={cn(
            "inline-flex items-center justify-center rounded-full text-nf-text-muted hover:text-electric-300 transition-colors shrink-0",
            className
          )}
        >
          <HelpCircle className={iconSize} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align="start"
        className="w-72 text-xs space-y-2 bg-nf-surface border-electric-300/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="text-[10px] uppercase tracking-wider text-electric-300 mb-0.5">Mi ez?</div>
          <p className="text-white/90 leading-relaxed">{what}</p>
        </div>
        {why && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-electric-300 mb-0.5">Mire jó?</div>
            <p className="text-nf-text-muted leading-relaxed">{why}</p>
          </div>
        )}
        {how && (
          <div className="pt-1 border-t border-nf-border">
            <div className="text-[10px] uppercase tracking-wider text-emerald-400 mb-0.5">Tedd ezt most</div>
            <p className="text-white/80 leading-relaxed">{how}</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

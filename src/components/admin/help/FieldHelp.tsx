import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Small info icon with tooltip — drop next to any label so the user knows what the field does.
 *   <Label>Subject <FieldHelp text="Ez kerül a postafiók tárgy mezőjébe." /></Label>
 */
export function FieldHelp({ text, className = "" }: { text: string; className?: string }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            tabIndex={-1}
            className={`inline-flex items-center justify-center text-nf-text-muted hover:text-electric-300 transition-colors ${className}`}
            aria-label="Súgó"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default FieldHelp;

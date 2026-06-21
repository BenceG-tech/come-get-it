import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, Sparkles } from "lucide-react";

interface Props {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Példák / sub-todo lista */
  examples?: string[];
  ctaLabel?: string;
  onCta?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
  children?: ReactNode;
}

export default function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  examples,
  ctaLabel,
  onCta,
  secondaryLabel,
  onSecondary,
  className,
  children,
}: Props) {
  return (
    <Card className={cn("p-6 md:p-8 text-center space-y-3 border-dashed border-electric-300/30 bg-electric-300/5", className)}>
      <div className="mx-auto w-12 h-12 rounded-full bg-electric-300/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-electric-300" />
      </div>
      <div>
        <h3 className="font-bold text-base">{title}</h3>
        {description && <p className="text-sm text-nf-text-muted mt-1 max-w-md mx-auto">{description}</p>}
      </div>
      {examples && examples.length > 0 && (
        <ul className="text-xs text-nf-text-muted space-y-0.5 max-w-sm mx-auto text-left">
          {examples.map((e, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="text-electric-300">›</span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
      )}
      {(ctaLabel || secondaryLabel) && (
        <div className="flex flex-wrap gap-2 justify-center pt-1">
          {ctaLabel && onCta && (
            <Button variant="neon" size="sm" onClick={onCta}>{ctaLabel}</Button>
          )}
          {secondaryLabel && onSecondary && (
            <Button variant="outline" size="sm" onClick={onSecondary}>{secondaryLabel}</Button>
          )}
        </div>
      )}
      {children}
    </Card>
  );
}

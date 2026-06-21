import { ReactNode } from "react";
import PageIntro from "@/components/admin/help/PageIntro";
import type { AdminPageHelpKey } from "@/lib/admin-help-content";

interface Props {
  title: string;
  subtitle?: string;
  helpSlug?: AdminPageHelpKey;
  actions?: ReactNode;
}

/**
 * Egységes admin oldalfej: cím + alcím + akciók + opcionális súgó-chip.
 * A súgó alapból csukva van (PageIntro maga kezeli a localStorage-t).
 */
export default function PageHeader({ title, subtitle, helpSlug, actions }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-nf-text-muted mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      {helpSlug && <PageIntro slug={helpSlug} />}
    </div>
  );
}

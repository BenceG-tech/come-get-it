import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type SectionNavItem = {
  id: string;
  label: string;
  icon?: LucideIcon;
};

type Props = {
  sections: SectionNavItem[];
  /** Override sticky offset (px) — defaults to 80px to clear topbar. */
  topOffset?: number;
};

/**
 * Quick-jump in-page navigation.
 * - Desktop xl+: floating fixed dot-rail on the right side, expands labels on hover.
 * - lg and below: sticky horizontal scroll-bar at the top of the page.
 *
 * Clicking dispatches `admin-section-open` (CustomEvent with id) so collapsed
 * Section components can auto-open before scrolling.
 */
export default function PageSectionNav({ sections, topOffset = 80 }: Props) {
  const [active, setActive] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: `-${topOffset}px 0px -60% 0px`, threshold: [0, 0.1, 0.5] }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections, topOffset]);

  const jump = (id: string) => {
    window.dispatchEvent(new CustomEvent("admin-section-open", { detail: { id } }));
    // small delay so collapsible content has time to render before scrolling
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    setActive(id);
  };

  return (
    <>
      {/* Mobile / tablet: sticky horizontal tabs */}
      <div
        className="xl:hidden sticky z-20 -mx-4 md:-mx-6 px-4 md:px-6 py-2 mb-3 bg-nf-bg/90 backdrop-blur-md border-b border-nf-border/60"
        style={{ top: 0 }}
      >
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => jump(s.id)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors border",
                  isActive
                    ? "bg-electric-300/15 text-electric-300 border-electric-300/40"
                    : "bg-nf-surface-alt/60 text-nf-text-muted border-nf-border hover:text-white"
                )}
              >
                {Icon && <Icon className="h-3 w-3" />}
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop xl+: floating right dot-rail */}
      <nav
        aria-label="Oldal szekciók"
        className="hidden xl:flex fixed right-4 z-20 flex-col gap-1 group/rail"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        {sections.map((s) => {
          const Icon = s.icon;
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => jump(s.id)}
              className={cn(
                "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full text-[11px] transition-all border whitespace-nowrap",
                isActive
                  ? "bg-electric-300/15 text-electric-300 border-electric-300/40 pl-3"
                  : "bg-nf-surface/80 backdrop-blur text-nf-text-muted border-nf-border/60 hover:text-white hover:border-electric-300/40 max-w-[14px] overflow-hidden group-hover/rail:max-w-[240px]"
              )}
              style={{ transitionProperty: "max-width, color, background-color, border-color, padding" }}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full shrink-0",
                  isActive ? "bg-electric-300" : "bg-nf-text-muted/60"
                )}
              />
              {Icon && <Icon className="h-3 w-3 shrink-0" />}
              <span className="truncate">{s.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
